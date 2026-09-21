/**
 * API.JS - Cloudflare Worker Integration
 * Tashrif AI
 * 
 * File ini menangani komunikasi dengan Cloudflare Worker
 * yang kemudian berkomunikasi dengan Cohere API
 */

'use strict';

const API = {
    /**
     * Call Cloudflare Worker endpoint
     * 
     * @param {string} prompt - Prompt yang akan dikirim ke AI
     * @param {string|null} apiKey - TIDAK DIGUNAKAN (backward compatibility)
     * @param {string} model - Model AI yang akan digunakan
     * @returns {Promise<Object>} - Parsed JSON response
     * @throws {Error} - Jika terjadi error saat API call
     */
    async call(prompt, apiKey, model) {
        // Validate prompt
        if (!prompt || typeof prompt !== 'string') {
            throw new Error('Prompt tidak valid');
        }

        try {
            // Call Cloudflare Worker endpoint
            const response = await fetch('/api/tashrif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: model || 'command-r7b-12-2024'
                })
            });

            // Handle HTTP errors
            if (!response.ok) {
                let errorMessage = `Error ${response.status}`;
                
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // Jika gagal parse JSON error, gunakan status text
                    errorMessage = response.statusText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }

            // Parse response
            const data = await response.json();
            
            // Extract text dari response Cohere
            // Cohere v2 API structure: data.message.content[0].text
            const text = data.message?.content?.[0]?.text || data.text || '';

            if (!text) {
                throw new Error('Response kosong dari server');
            }

            // Parse JSON dari text response
            return this.parseJSON(text);
            
        } catch (error) {
            // Re-throw dengan message yang lebih user-friendly
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
            }
            
            throw error;
        }
    },

    /**
     * Parse JSON from AI response text
     * 
     * AI sering mengembalikan JSON dengan markdown wrapper (```json ... ```)
     * atau dengan text tambahan. Function ini membersihkan dan parse JSON-nya.
     * 
     * @param {string} raw - Raw text response dari AI
     * @returns {Object} - Parsed JSON object
     * @throws {Error} - Jika JSON tidak valid
     */
    parseJSON(raw) {
        if (!raw || typeof raw !== 'string') {
            throw new Error('Response text tidak valid');
        }

        // Bersihkan whitespace
        let str = raw.trim();

        // Hapus markdown code block jika ada
        // Pattern: ```json ... ``` atau ``` ... ```
        str = str.replace(/^```(?:json)?\s*/i, '');  // Hapus opening ```json atau ```
        str = str.replace(/\s*```$/i, '');           // Hapus closing ```

        // Trim lagi setelah cleaning
        str = str.trim();

        // Cari posisi JSON object (antara { dan })
        const start = str.indexOf('{');
        const end = str.lastIndexOf('}');

        // Jika ditemukan valid JSON boundaries
        if (start !== -1 && end > start) {
            str = str.slice(start, end + 1);
        }

        // Parse JSON
        try {
            const parsed = JSON.parse(str);
            
            // Validasi bahwa result adalah object
            if (typeof parsed !== 'object' || parsed === null) {
                throw new Error('Format JSON tidak valid');
            }
            
            return parsed;
            
        } catch (e) {
            // Log untuk debugging (bisa di-comment untuk production)
            console.error('Parse error:', e.message);
            console.error('Raw text:', raw);
            console.error('Cleaned text:', str);
            
            throw new Error(`Format data tidak valid: ${e.message}`);
        }
    },

    /**
     * Test connection ke API endpoint
     * 
     * @returns {Promise<boolean>} - true jika koneksi berhasil
     */
    async testConnection() {
        try {
            const response = await fetch('/api/tashrif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: 'test',
                    model: 'command-r7b-12-2024'
                })
            });

            return response.status !== 404; // 404 = endpoint tidak ada
        } catch (error) {
            return false;
        }
    }
};

/**
 * Export untuk testing (optional)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}