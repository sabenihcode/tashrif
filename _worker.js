/**
 * Cloudflare Pages Worker
 * Model: OpenAI GPT-OSS 20B
 * Anti-timeout optimized
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
        message: '✅ Tashrif AI Online',
        provider: 'NVIDIA',
        model: 'openai/gpt-oss-20b',
        description: 'Fast Arabic conjugation AI',
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
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      const apiKey = env.NVIDIA_API_KEY;
      
      if (!apiKey) {
        console.error('NVIDIA_API_KEY not found');
        return new Response(
          JSON.stringify({
            error: 'API key not configured',
            hint: 'Add NVIDIA_API_KEY in Settings',
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
      
      console.log('Calling NVIDIA API...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);
      
      try {
        const nvidiaResponse = await fetch(
          'https://integrate.api.nvidia.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + apiKey,
            },
            body: JSON.stringify({
              model: 'openai/gpt-oss-20b',
              messages: [
                {
                  role: 'system',
                  content: 'Arabic expert. JSON only.',
                },
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              temperature: 0.1,
              top_p: 0.85,
              max_tokens: 400,
              stream: false,
            }),
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!nvidiaResponse.ok) {
          const errorText = await nvidiaResponse.text();
          console.error('NVIDIA Error:', nvidiaResponse.status);
          
          if (nvidiaResponse.status === 524) {
            return new Response(
              JSON.stringify({
                error: 'Request timeout',
                message: 'AI terlalu lama. Coba kata lebih sederhana.',
                retryable: true,
              }),
              {
                status: 524,
                headers: {
                  ...corsHeaders,
                  'Content-Type': 'application/json',
                },
              }
            );
          }
          
          return new Response(
            JSON.stringify({
              error: 'NVIDIA API Error ' + nvidiaResponse.status,
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
        
        const data = await nvidiaResponse.json();
        console.log('Success');
        
        const content = data.choices?.[0]?.message?.content || '';
        
        if (!content) {
          return new Response(
            JSON.stringify({ error: 'Empty response' }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            }
          );
        }
        
        return new Response(
          JSON.stringify({
            text: content,
            message: {
              content: [{ text: content }],
            },
            model: 'openai/gpt-oss-20b',
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
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('Request timeout');
          return new Response(
            JSON.stringify({
              error: 'Request timeout',
              message: 'AI butuh waktu >9 detik. Coba prompt lebih pendek.',
              retryable: true,
            }),
            {
              status: 504,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
              },
            }
          );
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Worker Error:', error);
      return new Response(
        JSON.stringify({
          error: error.message || 'Internal server error',
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
      },
    }
  );
}
