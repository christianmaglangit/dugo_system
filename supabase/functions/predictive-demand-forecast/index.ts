// supabase/functions/predictive-demand-forecast/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { linearRegression, linearRegressionLine } from 'https://esm.sh/simple-statistics@7.8.3'
import { corsHeaders } from "../_shared/cors.ts";


// Define ang type sa atong historical data
interface IssuanceRecord {
  month_date: string
  wb_units: number
  prbc_units: number
  pc_units: number
  ffp_units: number
  prp_units: number
  cryo_units: number
  aph_units: number
}

// Function para mahimong array nga magamit sa regression
// e.g., [[0, 200], [1, 500], [2, 581], ...]
function createRegressionData(data: IssuanceRecord[], component: keyof IssuanceRecord): number[][] {
  return data.map((record, index) => {
    // Ang 'x' (axis) kay ang index (0, 1, 2, 3...)
    // Ang 'y' (value) kay ang units para anang component
    const yValue = typeof record[component] === 'number' ? record[component] : 0;
    return [index, yValue];
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Maghimo ug Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Gamit ug Service Role Key para sa function
    )

    // 2. I-fetch ang TANAN historical data, gikan sa pinaka-una
    const { data: allData, error: fetchError } = await supabase
      .from('historical_issuances')
      .select('month_date, wb_units, prbc_units, pc_units, ffp_units, prp_units, cryo_units, aph_units')
      .order('month_date', { ascending: true })

    if (fetchError) throw fetchError
    if (!allData || allData.length === 0) {
      throw new Error("Wala'y historical data nga nakita.");
    }

    // Ang index para sa prediction (ang "sunod" nga bulan)
    const nextMonthIndex = allData.length;

    // 3. I-define ang mga components nga gusto nato i-predict
    const componentsToPredict: (keyof IssuanceRecord)[] = [
      'wb_units',
      'prbc_units',
      'pc_units',
      'ffp_units',
      'prp_units',
      'cryo_units',
      'aph_units',
    ];

    // 4. Mag-compute ug prediction para sa kada component
    const predictions = componentsToPredict.map(componentKey => {
      // Andamon ang data para sa regression
      const regressionData = createRegressionData(allData as IssuanceRecord[], componentKey);
      
      // Maghimo sa linear regression model
      const model = linearRegression(regressionData);
      
      // Maghimo sa "line" function gikan sa model
      const predictFunction = linearRegressionLine(model);
      
      // I-predict ang value para sa "sunod nga bulan"
      const predictedValue = predictFunction(nextMonthIndex);

      // Limpyohan ang output
      const componentName = componentKey.replace('_units', '').toUpperCase(); // 'wb_units' -> 'WB'
      return {
        type: componentName,
        predicted_demand: Math.max(0, Math.round(predictedValue)) // Sigurohon nga dili negative
      };
    });
    
    // I-sort gikan sa pinakataas nga demand
    const sortedPredictions = predictions.sort((a, b) => b.predicted_demand - a.predicted_demand);

    // 5. I-return ang resulta
    return new Response(JSON.stringify(sortedPredictions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})