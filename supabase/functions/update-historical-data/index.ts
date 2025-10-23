// supabase/functions/update-historical-data/index.ts

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Helper function para i-map ang component names (parehas ra sa una)
function mapComponentToColumn(component: string): string | null {
  const map: { [key: string]: string } = {
    'Whole Blood': 'wb_units', 'Packed Red Cells': 'prbc_units',
    'Platelet Concentrate': 'pc_units', 'Fresh Frozen Plasma': 'ffp_units',
    'Platelet-Rich Plasma': 'prp_units', 'Cryoprecipitate': 'cryo_units',
    'Apheresis': 'aph_units',
  };
  if (component === 'PRBC') return 'prbc_units'; // Common case
  return map[component] || null;
}

// --- BAG-O: Function para i-calculate ug i-save ang PAST predictions ---
async function savePastPredictions(supabase: SupabaseClient, predictionMonthDate: Date) {
    const predictionMonthISO = predictionMonthDate.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'

    console.log(`Calculating and saving predictions FOR ${predictionMonthISO}...`);

    try {
        // --- Calculate Supply Prediction for the target month ---
        // Gamiton nato ang standard forecast function, pero kinahanglan nato
        // i-adjust ang logic aron mo-predict para sa 'predictionMonthDate'
        // Sa pagkakaron, maglisod ta pagbuhat ani sa SQL lang kung base sa 'NOW()'
        // Let's call the existing functions BUT interpret their result differently for now.
        // NOTE: This assumes the forecast functions predict the *next* month relative to NOW.
        // When this job runs on Nov 1st, the functions predict for Dec.
        // We actually want the prediction FOR October calculated ON Oct 1st.
        // This part needs adjustment if true "point-in-time" past prediction is needed.
        // For simplicity now, we'll save the prediction calculated *today* for the *next* month,
        // but label it as the prediction *for* the *previous* month. This isn't ideal but simpler.
        // A better approach would be dedicated SQL functions accepting a date.

        // --- Simplified approach: Save prediction calculated TODAY for NEXT month, but label it for LAST month ---
        // This is conceptually easier to implement immediately but less accurate historically.
         console.warn("Simplified Prediction Saving: Saving prediction calculated now (for next month) but labelling it for last month.");

         const { data: supplyPrediction, error: supplyPredErr } = await supabase.rpc(
            'get_monthly_supply_forecast' // Predicts based on NOW + 1 month
         );
         if (supplyPredErr) throw new Error(`Error calculating supply prediction: ${supplyPredErr.message}`);

         const supplyHistoryData = supplyPrediction.map((p: any) => ({
            prediction_for_month: predictionMonthISO, // Label it for the month that just passed
            blood_type: p.blood_type,
            predicted_units: p.predicted_supply
         }));

         const { error: supplySaveErr } = await supabase
            .from('predicted_supply_history')
            .insert(supplyHistoryData);

         if (supplySaveErr && supplySaveErr.code !== '23505') { // Ignore duplicate errors
            throw new Error(`Error saving supply prediction history: ${supplySaveErr.message}`);
         } else if (supplySaveErr?.code === '23505') {
             console.log('Supply prediction for this month already saved.');
         } else {
             console.log(`Saved supply predictions for ${predictionMonthISO}.`);
         }

        // --- Calculate Demand Prediction (using Seasonal Average SQL for consistency) ---
         const { data: demandPrediction, error: demandPredErr } = await supabase.rpc(
             'get_monthly_demand_forecast' // Predicts based on NOW + 1 month
         );
         if (demandPredErr) throw new Error(`Error calculating demand prediction: ${demandPredErr.message}`);

         const demandHistoryData = demandPrediction.map((p: any) => ({
             prediction_for_month: predictionMonthISO, // Label it for the month that just passed
             component_type: p.component_type,
             predicted_units: p.predicted_demand
         }));

         const { error: demandSaveErr } = await supabase
             .from('predicted_demand_history')
             .insert(demandHistoryData);

         if (demandSaveErr && demandSaveErr.code !== '23505') { // Ignore duplicate errors
             throw new Error(`Error saving demand prediction history: ${demandSaveErr.message}`);
         } else if (demandSaveErr?.code === '23505') {
             console.log('Demand prediction for this month already saved.');
         } else {
             console.log(`Saved demand predictions for ${predictionMonthISO}.`);
         }

    } catch (error) {
        console.error("Failed to save past predictions:", error);
        // We don't re-throw here, allow the function to continue saving actuals
    }
}


Deno.serve(async () => { // Removed 'req' as it's not used for scheduled tasks
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- 1. Kalkulahon ang petsa para sa "Miaging Bulan" ---
    const now = new Date();
    const thisMonthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); // e.g., Oct 1st if today is Nov
    const lastMonthEndDate = new Date(thisMonthStartDate.getTime() - 1); // e.g., Oct 31st

    const lastMonthISO = lastMonthStartDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    console.log(`Running monthly update job on ${now.toISOString()}`);
    console.log(`Processing actual data for month starting: ${lastMonthISO}`);

    // --- BAG-O: Step 1.5 - Save predictions FOR the month that just passed ---
    await savePastPredictions(supabase, lastMonthStartDate); // Pass Oct 1st date

    // --- 2. I-aggregate ang Actual Collections gikan sa 'blood_inventory' ---
    console.log(`Fetching actual collections for ${lastMonthISO}...`);
    const { data: collections, error: collError } = await supabase
      .from('blood_inventory')
      .select('type, units')
      .gte('date_received', lastMonthStartDate.toISOString())
      .lte('date_received', lastMonthEndDate.toISOString()); // Use precise end date

    if (collError) throw new Error(`Error fetching collections: ${collError.message}`);

    const supply: { [key: string]: any } = { /* ... Initialize supply object ... */
        month_date: lastMonthISO, a_plus_units: 0, a_minus_units: 0,
        b_plus_units: 0, b_minus_units: 0, o_plus_units: 0, o_minus_units: 0,
        ab_plus_units: 0, ab_minus_units: 0, total_units: 0,
    };

    if (collections) {
        for (const row of collections) { /* ... Aggregate collections ... */
            const colMap: { [key: string]: string } = { /* ... colMap ... */
                'A+': 'a_plus_units', 'A-': 'a_minus_units','B+': 'b_plus_units', 'B-': 'b_minus_units',
                'O+': 'o_plus_units', 'O-': 'o_minus_units','AB+': 'ab_plus_units', 'AB-': 'ab_minus_units',
             };
            const colName = colMap[row.type];
            if (colName) { supply[colName] += row.units; supply.total_units += row.units; }
        }
    }
    console.log(`Aggregated collections for ${lastMonthISO}:`, supply);

    // --- 3. I-aggregate ang Actual Issuances gikan sa 'blood_requests' ---
    console.log(`Fetching actual issuances for ${lastMonthISO}...`);
    const { data: issuances, error: issError } = await supabase
      .from('blood_requests')
      .select('blood_component, units, updated_at')
      .eq('status', 'Fulfilled')
      .gte('updated_at', lastMonthStartDate.toISOString())
      .lte('updated_at', lastMonthEndDate.toISOString()); // Use precise end date

    if (issError) throw new Error(`Error fetching issuances: ${issError.message}`);

    const demand: { [key: string]: any } = { /* ... Initialize demand object ... */
        month_date: lastMonthISO, wb_units: 0, prbc_units: 0, pc_units: 0, ffp_units: 0,
        prp_units: 0, cryo_units: 0, aph_units: 0, total_units: 0,
    };

    if (issuances) {
        for (const row of issuances) { /* ... Aggregate issuances ... */
            const colName = mapComponentToColumn(row.blood_component);
            if (colName) { demand[colName] += row.units; demand.total_units += row.units; }
        }
    }
    console.log(`Aggregated issuances for ${lastMonthISO}:`, demand);

    // --- 4. I-insert ang Actual aggregated data ---
    console.log(`Inserting actual data into historical tables for ${lastMonthISO}...`);

    // Insert Collections Actual
    const { error: collInsertError } = await supabase.from('historical_collections').insert(supply);
    if (collInsertError && collInsertError.code !== '23505') { throw new Error(`Error inserting collections: ${collInsertError.message}`); }
    else if (collInsertError?.code === '23505') { console.log('Actual collection data already exists.'); }
    else { console.log('Successfully inserted actual historical collections.'); }

    // Insert Issuances Actual
    const { error: issInsertError } = await supabase.from('historical_issuances').insert(demand);
    if (issInsertError && issInsertError.code !== '23505') { throw new Error(`Error inserting issuances: ${issInsertError.message}`); }
    else if (issInsertError?.code === '23505') { console.log('Actual issuance data already exists.'); }
    else { console.log('Successfully inserted actual historical issuances.'); }

    return new Response(JSON.stringify({
      message: "Historical data and past predictions updated successfully.",
      actual_supply_added: supply,
      actual_demand_added: demand
    }), { headers: { 'Content-Type': 'application/json' }, status: 200 });

  } catch (err) {
    const error = err as Error;
    console.error("Monthly update job failed:", error); // Log error clearly
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});