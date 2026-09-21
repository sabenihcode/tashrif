/**
 * Cloudflare Pages Function
 * File: functions/api.js
 * Endpoint: /api (catch all)
 */

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // Log untuk debugging
    console.log('Request URL:', url.pathname);
    console.log('Request Method:', request.method);
    
    // Only handle /api/tashrif
    if (!url.pathname.startsWith('/api')) {
        return new Response('Not Found', { status: 404 });
    }
    
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // OPTIONS
    if (request.method === 'OPTIONS') {
        return new Response(null, { 
            status: 204,
            headers: corsHeaders 
        });
    }
    
    // GET - Test endpoint
    if (request.method === 'GET') {
        return new Response(
            JSON.stringify({ 
                message: '✅ Tashrif AI Function is ONLINE!',
                endpoint: url.pathname,
                timestamp: new Date().toISOString(),
                status: 'working'
            }),
            {
                status: 200,
                headers: { 
                    ...corsHeaders, 
                    'Content-Type': 'application/json' 
                }
            }
        );
    }
    
    // POST - Main handler
    if (request.method === 'POST') {
        try {
            const body = await request.json().catch(() => ({}));
            const { prompt, model } = body;
            
            if (!prompt) {
                return new Response(
                    JSON.stringify({ error: 'Prompt is required' }),
                    { 
                        status: 400, 
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                    }
                );
            }
            
            const apiKey = env.COHERE_API_KEY;
            
            if (!apiKey) {
                console.error('COHERE_API_KEY not found in environment variables');
                return new Response(
                    JSON.stringify({ 
                        error: 'API key not configured. Please add COHERE_API_KEY to environment variables in Cloudflare Pages settings.' 
                    }),
                    { 
                        status: 500, 
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                    }
                );
            }
            
            console.log('✅ API Key found');
            console.log('📤 Calling Cohere API...');
            
            const cohereResponse = await fetch('https://api.cohere.com/v2/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model || 'command-r7b-12-2024',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                    temperature: 0.1,
                    max_tokens: 2560
                })
            });
            
            if (!cohereResponse.ok) {
                const errorText = await cohereResponse.text();
                console.error('Cohere API Error:', errorText);
                return new Response(
                    JSON.stringify({ 
                        error: `Cohere API Error: ${cohereResponse.status}`,
                        details: errorText
                    }),
                    { 
                        status: cohereResponse.status, 
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                    }
                );
            }
            
            const data = await cohereResponse.json();
            console.log('✅ Cohere API Success');
            
            return new Response(
                JSON.stringify(data),
                {
                    status: 200,
                    headers: { 
                        ...corsHeaders, 
                        'Content-Type': 'application/json' 
                    }
                }
            );
            
        } catch (error) {
            console.error('Function Error:', error);
            return new Response(
                JSON.stringify({ 
                    error: error.message,
                    stack: error.stack 
                }),
                { 
                    status: 500, 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
                }
            );
        }
    }
    
    return new Response(
        JSON.stringify({ error: 'Method Not Allowed' }),
        { 
            status: 405, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
    );
}