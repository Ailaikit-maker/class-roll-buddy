import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, submissionText } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const detectionPrompt = `You are an AI detection expert analyzing student work for signs of AI-generated content.

Analyze the following submission for indicators of AI usage:

Submission Text:
${submissionText}

Look for these indicators:
1. Overly formal or academic language inconsistent with typical student writing
2. Perfect grammar and structure throughout
3. Lack of personal voice or informal expressions
4. Generic or templated responses
5. Unusual consistency in sentence structure
6. Technical vocabulary used perfectly without explanation
7. Lack of minor errors typical in human writing

Provide your analysis as JSON with this structure:
{
  "aiDetected": <boolean>,
  "confidence": <number 0-100>,
  "indicators": ["<indicator 1>", "<indicator 2>", ...],
  "summary": "<brief explanation of your determination>",
  "recommendations": "<suggestions for the teacher>"
}`;

    console.log('Calling AI for detection...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an AI detection expert. Always respond with valid JSON.' },
          { role: 'user', content: detectionPrompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI detection response received');
    
    const detectionResult = JSON.parse(aiData.choices[0].message.content);

    // Update submission with AI detection results
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        ai_usage_detected: detectionResult.aiDetected,
        ai_detection_details: detectionResult
      })
      .eq('id', submissionId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ 
      success: true, 
      ...detectionResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error detecting AI usage:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});