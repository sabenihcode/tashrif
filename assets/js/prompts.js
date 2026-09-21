/**
 * PROMPTS.JS - ULTRA COMPACT (Anti-Timeout)
 */

'use strict';

const Prompts = {
    /**
     * Istilahi - Minimal prompt
     */
    istilahi(query) {
        return `Arabic word: ${query}

Tashrif istilahi JSON:
{
  "type":"fiil",
  "bab_title":"Tsulatsi Mujarrad",
  "root":"k t b",
  "meaning":"Menulis",
  "isMutal":false,
  "mutalType":null,
  "isMudhaaf":false,
  "arabic_root":"كَتَبَ",
  "istilahi":[
    {"label":"Madhi Ma'lum","wazan":"فَعَلَ","mauzun":"كَتَبَ","arti":"Telah menulis"},
    {"label":"Mudhari Ma'lum","wazan":"يَفْعُلُ","mauzun":"يَكْتُبُ","arti":"Sedang menulis"},
    {"label":"Mashdar","wazan":"فَعْلٌ","mauzun":"كَتْبٌ","arti":"Tulisan"},
    {"label":"Isim Fa'il","wazan":"فَاعِلٌ","mauzun":"كَاتِبٌ","arti":"Penulis"},
    {"label":"Isim Maf'ul","wazan":"مَفْعُولٌ","mauzun":"مَكْتُوبٌ","arti":"Yang ditulis"},
    {"label":"Fi'il Amr","wazan":"اُفْعُلْ","mauzun":"اُكْتُبْ","arti":"Menulislah!"},
    {"label":"Fi'il Nahi","wazan":"لَا تَفْعُلْ","mauzun":"لَا تَكْتُبْ","arti":"Jangan menulis!"},
    {"label":"Isim Zaman/Makan","wazan":"مَفْعَلٌ","mauzun":"مَكْتَبٌ","arti":"Tempat menulis"}
  ]
}

JSON only.`;
    },

    /**
     * Lughawi - Minimal prompt
     */
    lughawi(query, arabic) {
        return `Tashrif lughawi: ${query} (${arabic})

Format:
{"madhi":[{"d":"هُوَ","l":"Dia lk","f":"جَلَسَ","a":"Dia lk telah duduk"},...],"mudhari":[...],"amr":[...]}

34 total (14+14+6). JSON only.`;
    }
};
