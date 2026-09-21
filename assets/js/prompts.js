/**
 * PROMPTS.JS - Optimized for Qwen 3.8 Flash
 * Short, structured prompts for ultra-fast response
 */

'use strict';

const Prompts = {
    /**
     * Istilahi - Optimized for Qwen
     */
    istilahi(query) {
        return `Analyze Arabic word: "${query}"

Task: Provide tashrif istilahi (morphological conjugation)

Output JSON format:
{
  "type": "fiil",
  "bab_title": "Tsulatsi Mujarrad",
  "root": "k t b",
  "meaning": "Menulis",
  "isMutal": false,
  "mutalType": null,
  "isMudhaaf": false,
  "arabic_root": "كَتَبَ",
  "istilahi": [
    {"label": "Madhi Ma'lum", "wazan": "فَعَلَ", "mauzun": "كَتَبَ", "arti": "Telah menulis"},
    {"label": "Mudhari Ma'lum", "wazan": "يَفْعُلُ", "mauzun": "يَكْتُبُ", "arti": "Sedang menulis"},
    {"label": "Mashdar", "wazan": "فَعْلٌ", "mauzun": "كَتْبٌ", "arti": "Tulisan"},
    {"label": "Isim Fa'il", "wazan": "فَاعِلٌ", "mauzun": "كَاتِبٌ", "arti": "Penulis"},
    {"label": "Isim Maf'ul", "wazan": "مَفْعُولٌ", "mauzun": "مَكْتُوبٌ", "arti": "Yang ditulis"},
    {"label": "Fi'il Amr", "wazan": "اُفْعُلْ", "mauzun": "اُكْتُبْ", "arti": "Menulislah!"},
    {"label": "Fi'il Nahi", "wazan": "لَا تَفْعُلْ", "mauzun": "لَا تَكْتُبْ", "arti": "Jangan menulis!"},
    {"label": "Isim Zaman/Makan", "wazan": "مَفْعَلٌ", "mauzun": "مَكْتَبٌ", "arti": "Tempat menulis"}
  ]
}

Important:
- If input is Isim (جَالِسٌ), find root verb first (جَلَسَ)
- Madhi = past tense (فَعَلَ), Mudhari = present (يَفْعُلُ)
- NO Isim Maf'ul for intransitive verbs
- Check harakat carefully
- Translation in Indonesian

Respond with valid JSON only.`;
    },

    /**
     * Lughawi - Optimized for Qwen
     */
    lughawi(query, arabic) {
        return `Create tashrif lughawi for: "${query}" (${arabic})

34 conjugations needed: 14 madhi + 14 mudhari + 6 amr

JSON structure:
{
  "madhi": [
    {"d":"هُوَ","l":"Dia lk","f":"جَلَسَ","a":"Dia lk telah duduk"},
    {"d":"هُمَا","l":"Mrk 2 lk","f":"جَلَسَا","a":"Mrk berdua lk telah duduk"},
    ...14 total
  ],
  "mudhari": [
    {"d":"هُوَ","l":"Dia lk","f":"يَجْلِسُ","a":"Dia lk sedang duduk"},
    ...14 total
  ],
  "amr": [
    {"d":"أَنْتَ","l":"Kamu lk","f":"اِجْلِسْ","a":"Duduklah! (lk)"},
    ...6 total
  ]
}

Requirements:
- All harakat must be correct
- Indonesian translation for all forms
- Consistent verb pattern

Respond with valid JSON only.`;
    }
};
