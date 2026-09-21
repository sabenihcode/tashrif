/**
 * UI.JS - UI Rendering Functions
 * Tashrif AI
 */

'use strict';

const UI = {
    /**
     * Add user message to chat
     */
    addUserMessage(text) {
        const chat = $('chatArea');
        const welcome = $('welcomeMessage');
        
        if (welcome) {
            welcome.style.display = 'none';
        }
        
        const div = document.createElement('div');
        div.className = 'message message-user';
        div.innerHTML = `<div class="bubble-user">${escapeHtml(text)}</div>`;
        chat.appendChild(div);
        scrollToBottom();
    },

    /**
     * Add AI message to chat
     */
    addAIMessage(html) {
        const chat = $('chatArea');
        const div = document.createElement('div');
        div.className = 'message message-ai';
        div.innerHTML = `<div class="bubble-ai">${html}</div>`;
        chat.appendChild(div);
        scrollToBottom();
    },

    /**
     * Show typing indicator
     */
    showTyping(label = 'Menganalisis…') {
        this.removeTyping();
        
        const chat = $('chatArea');
        const div = document.createElement('div');
        div.className = 'message message-ai';
        div.id = 'typingIndicator';
        div.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <span class="typing-label">${escapeHtml(label)}</span>
            </div>
        `;
        chat.appendChild(div);
        scrollToBottom();
    },

    /**
     * Remove typing indicator
     */
    removeTyping() {
        const el = $('typingIndicator');
        if (el) el.remove();
    },

    /**
     * Build result card HTML
     */
    buildResultCard(result, id) {
        const statusClass = result.isMutal ? 'tag-warning' : 
                          result.isMudhaaf ? 'tag-info' : 'tag-success';
        const statusIcon = result.isMutal ? 'fa-exclamation-circle' : 
                          result.isMudhaaf ? 'fa-compress-alt' : 'fa-check-circle';
        const statusText = result.isMutal ? `Mu'tal${result.mutalType ? ' · ' + result.mutalType : ''}` :
                          result.isMudhaaf ? "Mudha'af" : "Shohih";

        const cards = (result.istilahi || []).map(item => `
            <div class="istilahi-card">
                <div class="istilahi-label">${escapeHtml(item.label)}</div>
                <div class="istilahi-arabic">${item.mauzun}</div>
                <div class="istilahi-meaning">${escapeHtml(item.arti)}</div>
                <div class="istilahi-wazan">${item.wazan}</div>
            </div>
        `).join('');

        return `
            <div id="result-${id}">
                <div class="result-header">
                    <div class="result-info">
                        <div class="result-bab">${escapeHtml(result.bab_title || 'Tsulatsi Mujarrad')}</div>
                        <div class="result-meaning">${escapeHtml(result.meaning || '-')}</div>
                        <div class="result-root">
                            <i class="fas fa-layer-group" style="margin-right: 0.3rem; opacity: 0.5"></i>
                            ${(result.root || '').split('').join(' ')}
                        </div>
                        <span class="result-tag ${statusClass}">
                            <i class="fas ${statusIcon}"></i>
                            ${statusText}
                        </span>
                    </div>
                    <div class="result-arabic">${result.arabic_root || ''}</div>
                </div>
                
                <div class="action-buttons">
                    <button class="action-btn" id="copyBtn-${id}" onclick="App.copyResult('${id}')">
                        <i class="fas fa-copy"></i>
                        Salin
                    </button>
                    <button class="action-btn" onclick="App.shareResult('${id}')">
                        <i class="fas fa-share-alt"></i>
                        Bagikan
                    </button>
                </div>
                
                <div class="tabs">
                    <button class="tab-btn active" onclick="UI.switchTab('${id}', 'istilahi', this)">
                        <i class="fas fa-th-large"></i>
                        Istilahi
                    </button>
                    <button class="tab-btn" onclick="UI.switchTab('${id}', 'lughawi', this)">
                        <i class="fas fa-table"></i>
                        Lughawi
                        <span class="tab-badge badge-blue" id="lgBadge-${id}">klik</span>
                    </button>
                </div>
                
                <div id="panel-is-${id}">
                    <div class="istilahi-grid">
                        ${cards}
                    </div>
                </div>
                
                <div id="panel-lg-${id}" style="display: none;">
                    ${this.buildLughawiPlaceholder(id)}
                </div>
            </div>
        `;
    },

    /**
     * Build lughawi placeholder
     */
    buildLughawiPlaceholder(id) {
        return `
            <div class="lazy-placeholder" onclick="App.loadLughawi('${id}')">
                <div class="lazy-icon">
                    <i class="fas fa-table"></i>
                </div>
                <div class="lazy-title">Lughawi Belum Dimuat</div>
                <div class="lazy-subtitle">
                    34 konjugasi dhamir<br>
                    Madhi · Mudhari · Amr
                </div>
                <button class="lazy-btn" onclick="event.stopPropagation(); App.loadLughawi('${id}')">
                    <i class="fas fa-bolt"></i>
                    Muat Sekarang
                </button>
            </div>
        `;
    },

    /**
     * Build loading state
     */
    buildLoading() {
        return `
            <div class="loading-state">
                <div class="spinner"></div>
                <div class="loading-title">Memuat tashrif lughawi…</div>
                <div class="loading-subtitle">Phase 2 — 34 konjugasi</div>
                <div class="progress-bar">
                    <div class="progress-bar-fill"></div>
                </div>
            </div>
        `;
    },

    /**
     * Build error state
     */
    buildError(message, id) {
        return `
            <div class="error-state">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="error-message">${escapeHtml(message)}</div>
                <button class="error-btn" onclick="App.retryLughawi('${id}')">
                    <i class="fas fa-redo"></i>
                    Coba Lagi
                </button>
            </div>
        `;
    },

    /**
     * Build lughawi content
     */
    buildLughawiContent(lg) {
        let html = '';
        
        const types = [
            { key: 'madhi', label: 'Madhi (ماضٍ)', icon: 'fa-history' },
            { key: 'mudhari', label: 'Mudhari (مُضَارِعٌ)', icon: 'fa-play' },
            { key: 'amr', label: 'Amr (أَمْرٌ)', icon: 'fa-exclamation' }
        ];
        
        types.forEach(type => {
            const rows = lg[type.key] || [];
            if (rows.length === 0) return;
            
            html += `
                <div class="lughawi-section">
                    <div class="lughawi-section-title">
                        <i class="fas ${type.icon}"></i>
                        ${type.label} (${rows.length})
                    </div>
                    <div class="lughawi-cards">
                        ${rows.map(r => `
                            <div class="lughawi-card">
                                <div>
                                    <div class="lughawi-dhamir">${r.d}</div>
                                    <div class="lughawi-dhamir-label">${escapeHtml(r.l)}</div>
                                </div>
                                <div class="lughawi-fiil">${r.f}</div>
                                <div class="lughawi-arti">${escapeHtml(r.a)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        return html || '<div class="history-empty"><i class="fas fa-info-circle"></i> Tidak ada data</div>';
    },

    /**
     * Switch tab
     */
    switchTab(id, panel, btn) {
        // Update buttons
        btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // Show/hide panels
        $(`panel-is-${id}`).style.display = panel === 'istilahi' ? 'block' : 'none';
        $(`panel-lg-${id}`).style.display = panel === 'lughawi' ? 'block' : 'none';
        
        // Load lughawi if needed
        if (panel === 'lughawi') {
            App.loadLughawi(id);
        }
    },

    /**
     * Update copy button state
     */
    updateCopyButton(id, copied = true) {
        const btn = $(`copyBtn-${id}`);
        if (!btn) return;
        
        if (copied) {
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
            
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = '<i class="fas fa-copy"></i> Salin';
            }, 2000);
        }
    },

    /**
     * Update lughawi badge
     */
    updateLughawiBadge(id, status) {
        const badge = $(`lgBadge-${id}`);
        if (!badge) return;
        
        const configs = {
            loading: { class: 'badge-blue', text: '⟳' },
            success: { class: 'badge-green', text: '✓' },
            error: { class: 'badge-red', text: '!' }
        };
        
        const config = configs[status];
        if (config) {
            badge.className = `tab-badge ${config.class}`;
            badge.textContent = config.text;
        }
    }
};