// supabase/functions/update-historical-data/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Helper function para i-map ang component names
function mapComponentToColumn(component: string): string | null {
  const map: { [key: string]: string } = {
    'Whole Blood': 'wb_units',
    'Packed Red Cells': 'prbc_units',
    'Platelet Concentrate': 'pc_units',
    'Fresh Frozen Plasma': 'ffp_units',
    'Platelet-Rich Plasma': 'prp_units',
    'Cryoprecipitate': 'cryo_units',
    'Apheresis': 'aph_units',
  };
  if (component === 'PRBC') return 'prbc_units';
  return map[component] || null;
}

// Ang `req` kay wala kinahanglana para sa cron job, mao nga ato gikuha.
Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- 1. Kalkulahon ang petsa para sa "Miaging Bulan" ---
    const now = new Date();
    const thisMonthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEndDate = new Date(thisMonthStartDate.getTime() - 1);

    console.log(`Nag-process para sa: ${lastMonthStartDate.toISOString()} hangtod ${lastMonthEndDate.toISOString()}`);

    // --- 2. I-aggregate ang Collections gikan sa 'blood_inventory' ---
    const { data: collections, error: collError } = await supabase
      .from('blood_inventory')
      .select('type, units')
      .gte('date_received', lastMonthStartDate.toISOString())
      .lte('date_received', lastMonthEndDate.toISOString());

    if (collError) throw new Error(`Error fetching collections: ${collError.message}`);

    const supply: { [key: string]: any } = {
      month_date: lastMonthStartDate.toISOString().split('T')[0], // format to 'YYYY-MM-DD'
      a_plus_units: 0, a_minus_units: 0,
      b_plus_units: 0, b_minus_units: 0,
      o_plus_units: 0, o_minus_units: 0,
      ab_plus_units: 0, ab_minus_units: 0,
      total_units: 0,
    };

    if (collections) {
      for (const row of collections) {
        const colMap: { [key: string]: string } = {
          'A+': 'a_plus_units', 'A-': 'a_minus_units',
          'B+': 'b_plus_units', 'B-': 'b_minus_units',
          'O+': 'o_plus_units', 'O-': 'o_minus_units',
          'AB+': 'ab_plus_units', 'AB-': 'ab_minus_units',
        };
        const colName = colMap[row.type];
        if (colName) {
          supply[colName] += row.units;
          supply.total_units += row.units;
        }
      }
    }
    
    // --- 3. I-aggregate ang Issuances gikan sa 'blood_requests' ---
    const { data: issuances, error: issError } = await supabase
      .from('blood_requests')
      .select('blood_component, units, updated_at')
      .eq('status', 'Fulfilled')
      .gte('updated_at', lastMonthStartDate.toISOString())
      .lte('updated_at', lastMonthEndDate.toISOString());

    if (issError) throw new Error(`Error fetching issuances: ${issError.message}`);

    const demand: { [key: string]: any } = {
      month_date: lastMonthStartDate.toISOString().split('T')[0], // format to 'YYYY-MM-DD'
      wb_units: 0, prbc_units: 0, pc_units: 0, ffp_units: 0,
      prp_units: 0, cryo_units: 0, aph_units: 0, total_units: 0,
    };

    if (issuances) {
      for (const row of issuances) {
        const colName = mapComponentToColumn(row.blood_component);
        if (colName) {
          demand[colName] += row.units;
          demand.total_units += row.units;
        }
      }
    }

    // --- 4. I-insert ang bag-ong aggregated data ---
    
    // I-insert sa historical_collections
    const { error: collInsertError } = await supabase
      .from('historical_collections')
      .insert(supply);
    if (collInsertError && collInsertError.code !== '23505') {
      throw new Error(`Error inserting collections: ${collInsertError.message}`);
    } else if (collInsertError?.code === '23505') {
        console.log('Collection data for this month already exists. Skipping.');
    } else {
        console.log('Successfully inserted historical collections.');
    }

    // I-insert sa historical_issuances
    const { error: issInsertError } = await supabase
      .from('historical_issuances')
      .insert(demand);
    if (issInsertError && issInsertError.code !== '23505') {
      throw new Error(`Error inserting issuances: ${issInsertError.message}`);
    } else if (issInsertError?.code === '23505') {
      console.log('Issuance data for this month already exists. Skipping.');
    } else {
      console.log('Successfully inserted historical issuances.');
    }

    return new Response(JSON.stringify({ 
      message: "Historical data updated successfully.",
      supply_added: supply,
      demand_added: demand
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    // I-handle nato ang 'error' is of type 'unknown'
    const error = err as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});