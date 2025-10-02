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
    const { submissionId, assignmentId, submissionText } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get assignment details and rubric
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('*, grading_rubrics(*)')
      .eq('id', assignmentId)
      .single();

    if (assignmentError) throw assignmentError;

    // Build grading prompt
    const rubricText = assignment.grading_rubrics
      .map((r: any) => `- ${r.criteria} (${r.points} points): ${r.description || ''}`)
      .join('\n');

    const gradingPrompt = `You are an expert teacher grading a student assignment.

Assignment: ${assignment.title}
Description: ${assignment.description}
Instructions: ${assignment.instructions || 'N/A'}
Total Points: ${assignment.total_points}

Grading Rubric:
${rubricText || 'No specific rubric provided. Grade based on quality, completeness, and understanding.'}

Student Submission:
${submissionText}

Please provide:
1. A numeric grade out of ${assignment.total_points} points
2. Detailed feedback explaining the grade, highlighting strengths and areas for improvement
3. Specific suggestions for how the student can improve

Format your response as JSON with this structure:
{
  "grade": <number>,
  "feedback": "<detailed feedback text>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<improvement 1>", "<improvement 2>", ...]
}`;

    console.log('Calling AI for grading...');

    // Call Lovable AI for grading
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert teacher. Always respond with valid JSON.' },
          { role: 'user', content: gradingPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');
    
    const gradingResult = JSON.parse(aiData.choices[0].message.content);

    // Update submission with grade and feedback
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        grade: gradingResult.grade,
        feedback: JSON.stringify({
          summary: gradingResult.feedback,
          strengths: gradingResult.strengths,
          improvements: gradingResult.improvements
        }),
        graded_at: new Date().toISOString(),
        graded_by: 'AI Grader'
      })
      .eq('id', submissionId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ 
      success: true, 
      grade: gradingResult.grade,
      feedback: gradingResult.feedback
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error grading assignment:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});