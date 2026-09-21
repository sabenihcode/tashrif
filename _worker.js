/**
 * Cloudflare Pages Worker with NVIDIA GLM-5.3
 * Model: z-ai/glm-5.3 (Zhipu AI ChatGLM)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Route: API endpoint
    if (url.pathname.startsWith('/api')) {
      return handleAPI(request, env, url);
    }
    
    // Route: Static assets
    return env.ASSETS.fetch(request);
  },
};

/**
 * Handle API requests
 */
async function handleAPI(request, env, url) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // OPTIONS (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // GET (Test endpoint)
  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        message: '✅ Tashrif AI is ONLINE!',
        provider: 'NVIDIA',
        model: 'z-ai/glm-5.3 (ChatGLM)',
        description: 'Chinese multilingual model with excellent Arabic support',
        endpoint: url.pathname,
        timestamp: new Date().toISOString(),
        status: 'working',
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
  
  // POST (Main AI handler)
  if (request.method === 'POST') {
    try {
      // Parse request
      const body = await request.json().catch(() => ({}));
      const { prompt } = body;
      
      // Validate
      if (!prompt || typeof prompt !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid prompt. String required.' }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      // Get API key
      const apiKey = env.NVIDIA_API_KEY;
      
      if (!apiKey) {
        console.error('❌ NVIDIA_API_KEY not found');
        return new Response(
          JSON.stringify({
            error: 'API key not configured',
            hint: 'Add NVIDIA_API_KEY in Cloudflare Pages Settings → Environment variables',
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      console.log('✅ API Key found');
      console.log('📤 Calling NVIDIA GLM-5.3...');
      
      // Call NVIDIA API with GLM-5.3 model
      const nvidiaResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'z-ai/glm-5.3',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in Arabic grammar (Nahwu and Sharaf). You provide accurate morphological analysis and conjugations of Arabic words. Always respond in valid JSON format without markdown code blocks.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,  // Lower = more consistent
          top_p: 0.95,
          max_tokens: 2048,
          stream: false,
        }),
      });
      
      // Handle errors
      if (!nvidiaResponse.ok) {
        const errorText = await nvidiaResponse.text();
        console.error('❌ NVIDIA API Error:', nvidiaResponse.status);
        console.error('Details:', errorText);
        
        return new Response(
          JSON.stringify({
            error: `NVIDIA API Error ${nvidiaResponse.status}`,
            details: errorText,
          }),
          {
            status: nvidiaResponse.status,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      // Parse response
      const data = await nvidiaResponse.json();
      console.log('✅ NVIDIA GLM-5.3 Success');
      
      // Extract content (OpenAI format)
      const content = data.choices?.[0]?.message?.content || '';
      
      if (!content) {
        return new Response(
          JSON.stringify({ error: 'Empty response from API' }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      // Return in format compatible with frontend
      return new Response(
        JSON.stringify({
          text: content,
          message: {
            content: [{ text: content }],
          },
          model: 'z-ai/glm-5.3',
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
          type: error.name,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  // Method not allowed
  return new Response(
    JSON.stringify({
      error: 'Method Not Allowed',
      allowed: ['GET', 'POST', 'OPTIONS'],
    }),
    {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        Allow: 'GET, POST, OPTIONS',
      },
    }
  );
}
