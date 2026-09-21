/**
 * Cloudflare Pages Worker
 * Model: Google Gemma 4 31B Instruct
 * Optimized for speed
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname.startsWith('/api')) {
      return handleAPI(request, env, url);
    }
    
    return env.ASSETS.fetch(request);
  },
};

async function handleAPI(request, env, url) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        message: '✅ Tashrif AI - Powered by Google Gemma 4',
        provider: 'NVIDIA',
        model: 'google/gemma-4-31b-it',
        description: 'Fast multilingual model with excellent Arabic support',
        status: 'online',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  if (request.method === 'POST') {
    try {
      const body = await request.json().catch(() => ({}));
      const { prompt } = body;
      
      if (!prompt || typeof prompt !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid prompt' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      const apiKey = env.NVIDIA_API_KEY;
      
      if (!apiKey) {
        console.error('❌ NVIDIA_API_KEY not found');
        return new Response(
          JSON.stringify({ error: 'API key not configured' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      console.log('📤 Calling Gemma 4 31B...');
      
      // Call NVIDIA API with Gemma 4
      const nvidiaResponse = await fetch(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'google/gemma-4-31b-it',
            messages: [
              {
                role: 'system',
                content: 'You are an Arabic grammar expert. Respond in valid JSON only, no markdown.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.2,      // Lower = faster & consistent
            top_p: 0.9,            // Focused
            max_tokens: 800,       // Reduced for speed (cukup untuk tashrif)
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false,
          }),
        }
      );
      
      if (!nvidiaResponse.ok) {
        const errorText = await nvidiaResponse.text();
        console.error('❌ NVIDIA Error:', nvidiaResponse.status);
        console.error('Details:', errorText);
        
        return new Response(
          JSON.stringify({
            error: `NVIDIA API Error ${nvidiaResponse.status}`,
            details: errorText,
          }),
          {
            status: nvidiaResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      const data = await nvidiaResponse.json();
      console.log('✅ Gemma 4 Success');
      
      const content = data.choices?.[0]?.message?.content || '';
      
      if (!content) {
        return new Response(
          JSON.stringify({ error: 'Empty response' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      // Return compatible format
      return new Response(
        JSON.stringify({
          text: content,
          message: {
            content: [{ text: content }],
          },
          model: 'google/gemma-4-31b-it',
          usage: data.usage,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
          },
        }
      );
    } catch (error) {
      console.error('❌ Worker Error:', error);
      
      return new Response(
        JSON.stringify({
          error: error.message || 'Internal server error',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  return new Response(
    JSON.stringify({ error: 'Method Not Allowed' }),
    {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
