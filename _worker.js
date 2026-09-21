/**
 * Cloudflare Pages Worker
 * Model: Qwen 3.8 Flash (Alibaba)
 * Provider: zRouter.dev
 * Ultra-fast Arabic processing
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
        message: '✅ Tashrif AI - Ultra Fast Edition',
        provider: 'zRouter.dev',
        model: 'qwen3.8-flash',
        description: 'Alibaba Qwen 3.8B Flash - Optimized for speed',
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
      
      // API Key hardcoded (as provided)
      const apiKey = 'zr_41a799ef89361da161b8652d_iUpqUfCU1khGS8ZIUUIRDV1V_Y9-7D3NML21liuTh6o';
      
      console.log('📤 Calling Qwen 3.8 Flash...');
      
      const zrouterResponse = await fetch(
        'https://api.zrouter.dev/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'qwen3.8-flash',
            messages: [
              {
                role: 'system',
                content: 'You are an Arabic grammar expert. Respond in valid JSON format only, without markdown code blocks.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.2,
            max_tokens: 800,
            stream: false,
          }),
        }
      );
      
      if (!zrouterResponse.ok) {
        const errorText = await zrouterResponse.text();
        console.error('❌ zRouter Error:', zrouterResponse.status);
        console.error('Details:', errorText);
        
        return new Response(
          JSON.stringify({
            error: `API Error ${zrouterResponse.status}`,
            details: errorText,
          }),
          {
            status: zrouterResponse.status,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      const data = await zrouterResponse.json();
      console.log('✅ Qwen 3.8 Flash Success');
      
      // OpenAI format: extract content
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
      
      // Return in compatible format
      return new Response(
        JSON.stringify({
          text: content,
          message: {
            content: [{ text: content }],
          },
          model: 'qwen3.8-flash',
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
