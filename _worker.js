/**
 * Cloudflare Pages Advanced Mode Worker
 * File: _worker.js (di root repository)
 * 
 * File ini akan handle SEMUA request ke aplikasi
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // ============================================
    // ROUTE: /api/tashrif (API Endpoint)
    // ============================================
    if (url.pathname.startsWith('/api')) {
      return handleAPI(request, env, url);
    }
    
    // ============================================
    // ROUTE: Static Assets (HTML, CSS, JS, Images)
    // ============================================
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
        message: '✅ Tashrif AI Worker is ONLINE!',
        endpoint: url.pathname,
        method: 'POST required for AI processing',
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
      // Parse request body
      const body = await request.json().catch(() => ({}));
      const { prompt, model } = body;
      
      // Validate prompt
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
      
      // Get API key from environment
      const apiKey = env.COHERE_API_KEY;
      
      if (!apiKey) {
        console.error('❌ COHERE_API_KEY not found in environment variables');
        return new Response(
          JSON.stringify({
            error: 'API key not configured',
            hint: 'Add COHERE_API_KEY in Cloudflare Pages Settings → Environment variables',
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
      console.log('📤 Calling Cohere API...');
      console.log('Model:', model || 'command-r7b-12-2024');
      
      // Call Cohere API
      const cohereResponse = await fetch('https://api.cohere.com/v2/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || 'command-r7b-12-2024',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: {
            type: 'json_object',
          },
          temperature: 0.1,
          max_tokens: 2560,
        }),
      });
      
      // Handle Cohere API error
      if (!cohereResponse.ok) {
        const errorText = await cohereResponse.text();
        console.error('❌ Cohere API Error:', cohereResponse.status);
        console.error('Details:', errorText);
        
        return new Response(
          JSON.stringify({
            error: `Cohere API Error ${cohereResponse.status}`,
            details: errorText,
          }),
          {
            status: cohereResponse.status,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      // Success - return Cohere response
      const data = await cohereResponse.json();
      console.log('✅ Cohere API Success');
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      });
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
