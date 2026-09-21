/**
 * UTILS.JS - Utility Functions
 * Tashrif AI
 */

'use strict';

/**
 * Get element by ID shorthand
 */
function $(id) {
    return document.getElementById(id);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
    setTimeout(() => {
        const chat = $('chatArea');
        if (chat) {
            chat.scrollTop = chat.scrollHeight;
        }
    }, 80);
}

/**
 * Show toast notification
 */
function toast(message, duration = 2200) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = message;
    document.body.appendChild(t);
    
    setTimeout(() => t.remove(), duration);
}

/**
 * Format date for display
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Baru saja';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} menit lalu`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam lalu`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} hari lalu`;
    
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
    });
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    } catch (err) {
        console.error('Copy failed:', err);
        return false;
    }
}

/**
 * Check if Web Share API is supported
 */
function isShareSupported() {
    return navigator.share && navigator.canShare;
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'r' + Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * Truncate text
 */
function truncate(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}