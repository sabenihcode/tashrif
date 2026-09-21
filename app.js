/**
 * APP.JS - Main Application Logic
 * Tashrif AI
 */

'use strict';

const App = {
    // State
    model: 'command-r7b-12-2024',
    results: {},
    chatHistory: [],
    isLoading: false,
    
    // Storage key
    STORAGE_KEY: 'tashrif_v10',
    
    /**
     * Initialize app
     */
    init() {
        this.loadSettings();
        this.bindEvents();
        this.hideSplash();
    },
    
    /**
     * Hide splash screen
     */
    hideSplash() {
        setTimeout(() => {
            const splash = $('splashScreen');
            if (splash) {
                splash.classList.add('hidden');
                setTimeout(() => splash.remove(), 600);
            }
        }, 2500);
    },
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Close history on overlay click
        $('historyOverlay').addEventListener('click', () => {
            this.closeHistory();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', e => {
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeHistory();
            }
            
            // Ctrl/Cmd + H for history
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                this.openHistory();
            }
        });
    },
    
    /**
     * Load settings from storage
     */
    loadSettings() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                this.chatHistory = parsed.history || [];
                this.model = parsed.model || 'command-r7b-12-2024';
            }
        } catch (e) {
            console.warn('Load error:', e);
        }
        
        this.updateHistoryUI();
    },
    
    /**
     * Save settings to storage
     */
    saveSettingsToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                history: this.chatHistory,
                model: this.model
            }));
        } catch (e) {
            console.warn('Save error:', e);
        }
    },
    
    /**
     * Open history sidebar
     */
    openHistory() {
        $('historyOverlay').classList.add('open');
        $('historySidebar').classList.add('open');
    },
    
    /**
     * Close history sidebar
     */
    closeHistory() {
        $('historyOverlay').classList.remove('open');
        $('historySidebar').classList.remove('open');
    },
    
    /**
     * Update history UI
     */
    updateHistoryUI() {
        const list = $('historyList');
        
        if (this.chatHistory.length === 0) {
            list.innerHTML = `
                <div class="history-empty">
                    <div class="history-empty-icon">
                        <i class="fas fa-inbox"></i>
                    </div>
                    <div class="history-empty-text">Belum ada riwayat</div>
                </div>
            `;
            return;
        }
        
        list.innerHTML = this.chatHistory.map(item => `
            <div class="history-item" onclick="App.loadFromHistory('${item.id}')">
                <div class="history-item-icon">
                    <i class="fas fa-book"></i>
                </div>
                <div class="history-item-content">
                    <div class="history-item-query">${escapeHtml(item.query)}</div>
                    <div class="history-item-date">${formatDate(item.timestamp)}</div>
                </div>
                <button class="history-item-delete" 
                        onclick="event.stopPropagation(); App.deleteHistoryItem('${item.id}')"
                        title="Hapus">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    },
    
    /**
     * Add to history
     */
    addToHistory(query, resultId) {
        const item = {
            id: resultId,
            query: query,
            timestamp: new Date().toISOString(),
            meaning: this.results[resultId]?.meaning || '',
            arabic: this.results[resultId]?.arabic_root || ''
        };
        
        // Add to beginning
        this.chatHistory.unshift(item);
        
        // Limit to 50 items
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(0, 50);
        }
        
        this.saveSettingsToStorage();
        this.updateHistoryUI();
    },
    
    /**
     * Delete history item
     */
    deleteHistoryItem(id) {
        this.chatHistory = this.chatHistory.filter(item => item.id !== id);
        this.saveSettingsToStorage();
        this.updateHistoryUI();
        toast('Riwayat dihapus');
    },
    
    /**
     * Clear all history
     */
    clearHistory() {
        if (confirm('Hapus semua riwayat?')) {
            this.chatHistory = [];
            this.saveSettingsToStorage();
            this.updateHistoryUI();
            toast('Semua riwayat dihapus');
        }
    },
    
    /**
     * Load from history
     */
    loadFromHistory(id) {
        const item = this.chatHistory.find(h => h.id === id);
        
        if (this.results[id]) {
            // Result already in memory, scroll to it
            this.closeHistory();
            const element = $(`result-${id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else if (item) {
            // Re-search
            this.closeHistory();
            $('inputWord').value = item.query;
            this.handleSubmit({ preventDefault: () => {} });
        }
    },
    
    /**
     * Search example word
     */
    searchExample(word) {
        $('inputWord').value = word;
        this.handleSubmit({ preventDefault: () => {} });
    },
    
    /**
     * Handle form submit
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        const query = $('inputWord').value.trim();
        if (!query || this.isLoading) return;
        
        this.isLoading = true;
        $('sendBtn').disabled = true;
        $('sendText').textContent = '...';
        
        // Add user message
        UI.addUserMessage(query);
        $('inputWord').value = '';
        
        // Show typing
        UI.showTyping('Menganalisis…');
        
        try {
            // Call API (no API key needed, handled by Cloudflare Worker)
            const result = await API.call(
                Prompts.istilahi(query),
                null,
                this.model
            );
            
            // Generate ID
            const id = generateId();
            
            // Store result
            this.results[id] = {
                ...result,
                query: query,
                arabic_root: result.arabic_root || query,
                lg: null,
                lgLoading: false,
                lgLoaded: false
            };
            
            // Remove typing
            UI.removeTyping();
            
            // Add AI message
            UI.addAIMessage(UI.buildResultCard(result, id));
            
            // Add to history
            this.addToHistory(query, id);
            
        } catch (err) {
            UI.removeTyping();
            UI.addAIMessage(UI.buildError(err.message, 'main'));
        } finally {
            this.isLoading = false;
            $('sendBtn').disabled = false;
            $('sendText').textContent = 'Cari';
            $('inputWord').focus();
        }
    },
    
    /**
     * Load lughawi data
     */
    async loadLughawi(id) {
        const result = this.results[id];
        if (!result || result.lgLoading || result.lgLoaded) return;
        
        result.lgLoading = true;
        
        // Update UI
        const panel = $(`panel-lg-${id}`);
        if (panel) {
            panel.innerHTML = UI.buildLoading();
        }
        
        // Update badge
        UI.updateLughawiBadge(id, 'loading');
        
        try {
            const data = await API.call(
                Prompts.lughawi(result.query, result.arabic_root),
                null,
                this.model
            );
            
            // Validate data
            if (!data.madhi || !data.mudhari || !data.amr) {
                throw new Error('Data lughawi tidak lengkap');
            }
            
            // Normalize and store
            const normalize = arr => (arr || []).map(r => ({
                d: r.d || r.dhamir || '',
                l: r.l || r.label || '',
                f: r.f || r.fiil || '',
                a: r.a || r.arti || ''
            }));
            
            result.lg = {
                madhi: normalize(data.madhi),
                mudhari: normalize(data.mudhari),
                amr: normalize(data.amr)
            };
            result.lgLoaded = true;
            result.lgLoading = false;
            
            // Update badge
            UI.updateLughawiBadge(id, 'success');
            
            // Render content
            if (panel) {
                panel.innerHTML = UI.buildLughawiContent(result.lg);
            }
            
            toast('✓ Lughawi dimuat');
            
        } catch (err) {
            result.lgLoading = false;
            result.lgLoaded = false;
            
            // Update badge
            UI.updateLughawiBadge(id, 'error');
            
            // Show error
            if (panel) {
                panel.innerHTML = UI.buildError(err.message, id);
            }
        }
    },
    
    /**
     * Retry loading lughawi
     */
    retryLughawi(id) {
        const result = this.results[id];
        if (result) {
            result.lgLoading = false;
            result.lgLoaded = false;
        }
        this.loadLughawi(id);
    },
    
    /**
     * Copy result to clipboard
     */
    async copyResult(id) {
        const result = this.results[id];
        if (!result) return;
        
        let text = `📖 Tashrif: ${result.arabic_root || ''}
📝 Arti: ${result.meaning || ''}
🏷️ Bab: ${result.bab_title || 'Tsulatsi Mujarrad'}

📋 Tashrif Istilahi:
`;
        
        (result.istilahi || []).forEach(item => {
            text += `• ${item.label}: ${item.mauzun} (${item.arti})\n`;
        });
        
        if (result.lg) {
            text += '\n📖 Tashrif Lughawi:';
            
            ['madhi', 'mudhari', 'amr'].forEach(type => {
                const rows = result.lg[type] || [];
                if (rows.length > 0) {
                    text += `\n\n${type.toUpperCase()}:\n`;
                    rows.forEach(row => {
                        text += `• ${row.d} (${row.l}): ${row.f} - ${row.a}\n`;
                    });
                }
            });
        }
        
        text += '\n\nDicari dengan Tashrif AI';
        
        const success = await copyToClipboard(text);
        
        if (success) {
            UI.updateCopyButton(id, true);
            toast('✓ Disalin ke clipboard');
        } else {
            toast('❌ Gagal menyalin');
        }
    },
    
    /**
     * Share result
     */
    shareResult(id) {
        const result = this.results[id];
        if (!result) return;
        
        const text = `📖 Tashrif AI - ${result.arabic_root}
📝 Arti: ${result.meaning || ''}
🏷️ Bab: ${result.bab_title || 'Tsulatsi Mujarrad'}

Dicari dengan Tashrif AI`;
        
        if (isShareSupported()) {
            navigator.share({
                title: `Tashrif: ${result.arabic_root}`,
                text: text
            }).catch(() => {
                // User cancelled or error, fallback to copy
                this.copyResult(id);
            });
        } else {
            // Fallback to copy
            this.copyResult(id);
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});