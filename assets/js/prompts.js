/**
 * PROMPTS.JS - Optimized for NVIDIA GLM-5.3
 */

'use strict';

const Prompts = {
    /**
     * Istilahi prompt - GLM-5.3 optimized
     */
    istilahi(query) {
        return `Analyze the Arabic word "${query}" and provide its complete tashrif istilahi (morphological conjugation).

CRITICAL INSTRUCTIONS:
1. Identify the word type first: Fi'il Madhi, Fi'il Mudhari, Isim Fa'il, Mashdar, etc.
2. If the input is a derived form (Isim), find the ROOT VERB first
3. Provide conjugation from the ROOT VERB
4. Check all harakat (diacritical marks) carefully
5. Intransitive verbs (فِعْل لَازِم) DO NOT have Isim Maf'ul
6. Provide accurate Indonesian translations

EXAMPLE 1 - Input: جَالِسٌ (Isim Fa'il)
Analysis:
- This is Isim Fa'il (active participle)
- Root verb: جَلَسَ (to sit)
- Pattern: فَعَلَ - يَفْعِلُ  
- Type: Intransitive (لازم)

JSON Output:
{
  "type": "fiil",
  "bab_title": "Tsulatsi Mujarrad",
  "root": "j l s",
  "meaning": "Duduk",
  "isMutal": false,
  "mutalType": null,
  "isMudhaaf": false,
  "arabic_root": "جَلَسَ",
  "istilahi": [
    {"label": "Madhi Ma'lum", "wazan": "فَعَلَ", "mauzun": "جَلَسَ", "arti": "Telah duduk"},
    {"label": "Mudhari Ma'lum", "wazan": "يَفْعِلُ", "mauzun": "يَجْلِسُ", "arti": "Sedang duduk"},
    {"label": "Mashdar", "wazan": "فُعُولٌ", "mauzun": "جُلُوسٌ", "arti": "Duduk (kata benda)"},
    {"label": "Isim Fa'il", "wazan": "فَاعِلٌ", "mauzun": "جَالِسٌ", "arti": "Yang sedang duduk"},
    {"label": "Fi'il Amr", "wazan": "اِفْعِلْ", "mauzun": "اِجْلِسْ", "arti": "Duduklah!"},
    {"label": "Fi'il Nahi", "wazan": "لَا تَفْعِلْ", "mauzun": "لَا تَجْلِسْ", "arti": "Jangan duduk!"},
    {"label": "Isim Zaman/Makan", "wazan": "مَفْعِلٌ", "mauzun": "مَجْلِسٌ", "arti": "Tempat duduk"}
  ]
}

EXAMPLE 2 - Input: كَتَبَ (Fi'il Madhi - transitive)
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
    {"label": "Isim Zaman/Makan", "wazan": "مَفْعَلٌ", "mauzun": "مَكْتَبٌ", "arti": "Tempat menulis"},
    {"label": "Isim Alat", "wazan": "مِفْعَلٌ", "mauzun": "مِكْتَبٌ", "arti": "Alat menulis"}
  ]
}

IMPORTANT RULES:
- Madhi Ma'lum = Past tense (فَعَلَ form), NOT present tense
- Mudhari Ma'lum = Present tense (يَفْعُلُ form)
- Do NOT include Isim Maf'ul for intransitive verbs
- Do NOT include Isim Alat unless contextually appropriate
- All harakat must be accurate
- Meanings must be consistent

Now analyze: "${query}"

Respond with ONLY valid JSON, no markdown code blocks.`;
    },

    /**
     * Lughawi prompt - GLM-5.3 optimized
     */
    lughawi(query, arabic) {
        return `Create complete tashrif lughawi (conjugation table) for the Arabic word "${query}" (${arabic}).

INSTRUCTIONS:
1. Identify the root verb if input is a derived form
2. Use correct wazan (pattern): فَعَلَ - يَفْعُلُ or فَعَلَ - يَفْعِلُ or فَعَلَ - يَفْعَلُ
3. Check all harakat carefully
4. Provide accurate Indonesian translation for each form

OUTPUT FORMAT (JSON only):
{
  "madhi": [
    {"d": "هُوَ", "l": "Dia lk", "f": "جَلَسَ", "a": "Dia lk telah duduk"},
    {"d": "هُمَا", "l": "Mrk 2 lk", "f": "جَلَسَا", "a": "Mrk berdua lk telah duduk"},
    {"d": "هُمْ", "l": "Mrk lk", "f": "جَلَسُوا", "a": "Mereka lk telah duduk"},
    {"d": "هِيَ", "l": "Dia pr", "f": "جَلَسَتْ", "a": "Dia pr telah duduk"},
    {"d": "هُمَا", "l": "Mrk 2 pr", "f": "جَلَسَتَا", "a": "Mrk berdua pr telah duduk"},
    {"d": "هُنَّ", "l": "Mrk pr", "f": "جَلَسْنَ", "a": "Mereka pr telah duduk"},
    {"d": "أَنْتَ", "l": "Kamu lk", "f": "جَلَسْتَ", "a": "Kamu lk telah duduk"},
    {"d": "أَنْتُمَا", "l": "Klia 2 lk", "f": "جَلَسْتُمَا", "a": "Kalian 2 lk telah duduk"},
    {"d": "أَنْتُمْ", "l": "Klia lk", "f": "جَلَسْتُمْ", "a": "Kalian lk telah duduk"},
    {"d": "أَنْتِ", "l": "Kamu pr", "f": "جَلَسْتِ", "a": "Kamu pr telah duduk"},
    {"d": "أَنْتُمَا", "l": "Klia 2 pr", "f": "جَلَسْتُمَا", "a": "Kalian 2 pr telah duduk"},
    {"d": "أَنْتُنَّ", "l": "Klia pr", "f": "جَلَسْتُنَّ", "a": "Kalian pr telah duduk"},
    {"d": "أَنَا", "l": "Saya", "f": "جَلَسْتُ", "a": "Saya telah duduk"},
    {"d": "نَحْنُ", "l": "Kami", "f": "جَلَسْنَا", "a": "Kami telah duduk"}
  ],
  "mudhari": [
    {"d": "هُوَ", "l": "Dia lk", "f": "يَجْلِسُ", "a": "Dia lk sedang duduk"},
    {"d": "هُمَا", "l": "Mrk 2 lk", "f": "يَجْلِسَانِ", "a": "Mrk berdua lk sedang duduk"},
    {"d": "هُمْ", "l": "Mrk lk", "f": "يَجْلِسُونَ", "a": "Mereka lk sedang duduk"},
    {"d": "هِيَ", "l": "Dia pr", "f": "تَجْلِسُ", "a": "Dia pr sedang duduk"},
    {"d": "هُمَا", "l": "Mrk 2 pr", "f": "تَجْلِسَانِ", "a": "Mrk berdua pr sedang duduk"},
    {"d": "هُنَّ", "l": "Mrk pr", "f": "يَجْلِسْنَ", "a": "Mereka pr sedang duduk"},
    {"d": "أَنْتَ", "l": "Kamu lk", "f": "تَجْلِسُ", "a": "Kamu lk sedang duduk"},
    {"d": "أَنْتُمَا", "l": "Klia 2 lk", "f": "تَجْلِسَانِ", "a": "Kalian 2 lk sedang duduk"},
    {"d": "أَنْتُمْ", "l": "Klia lk", "f": "تَجْلِسُونَ", "a": "Kalian lk sedang duduk"},
    {"d": "أَنْتِ", "l": "Kamu pr", "f": "تَجْلِسِينَ", "a": "Kamu pr sedang duduk"},
    {"d": "أَنْتُمَا", "l": "Klia 2 pr", "f": "تَجْلِسَانِ", "a": "Kalian 2 pr sedang duduk"},
    {"d": "أَنْتُنَّ", "l": "Klia pr", "f": "تَجْلِسْنَ", "a": "Kalian pr sedang duduk"},
    {"d": "أَنَا", "l": "Saya", "f": "أَجْلِسُ", "a": "Saya sedang duduk"},
    {"d": "نَحْنُ", "l": "Kami", "f": "نَجْلِسُ", "a": "Kami sedang duduk"}
  ],
  "amr": [
    {"d": "أَنْتَ", "l": "Kamu lk", "f": "اِجْلِسْ", "a": "Duduklah! (lk)"},
    {"d": "أَنْتُمَا", "l": "Klia 2 lk", "f": "اِجْلِسَا", "a": "Duduklah! (2 lk)"},
    {"d": "أَنْتُمْ", "l": "Klia lk", "f": "اِجْلِسُوا", "a": "Duduklah! (klia lk)"},
    {"d": "أَنْتِ", "l": "Kamu pr", "f": "اِجْلِسِي", "a": "Duduklah! (pr)"},
    {"d": "أَنْتُمَا", "l": "Klia 2 pr", "f": "اِجْلِسَا", "a": "Duduklah! (2 pr)"},
    {"d": "أَنْتُنَّ", "l": "Klia pr", "f": "اِجْلِسْنَ", "a": "Duduklah! (klia pr)"}
  ]
}

CRITICAL:
- All harakat must be correct
- Meanings must match the conjugated form
- Use consistent tense in Indonesian translation
- Double-check dhammah/kasrah/fathah patterns

Respond with ONLY valid JSON for "${query}".`;
    }
};
