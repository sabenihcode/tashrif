/**
 * PROMPTS.JS - Optimized for Google Gemma 4
 * Short, focused prompts for faster response
 */

'use strict';

const Prompts = {
    /**
     * Istilahi - Ultra compact prompt
     */
    istilahi(query) {
        return `Analyze Arabic word: ${query}

Task: Provide tashrif istilahi in JSON format.

Rules:
- If input is Isim, find root verb first
- Madhi = فَعَلَ (past), Mudhari = يَفْعُلُ (present)  
- NO Isim Maf'ul for intransitive verbs
- Check harakat accuracy

JSON structure:
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

Respond JSON only, no markdown.`;
    },

    /**
     * Lughawi - Compact prompt
     */
    lughawi(query, arabic) {
        return `Create tashrif lughawi for: ${query} (${arabic})

34 conjugations needed: 14 madhi + 14 mudhari + 6 amr

JSON format:
{
  "madhi": [
    {"d":"هُوَ","l":"Dia lk","f":"جَلَسَ","a":"Dia lk telah duduk"},
    {"d":"هُمَا","l":"Mrk 2 lk","f":"جَلَسَا","a":"Mrk berdua lk telah duduk"},
    {"d":"هُمْ","l":"Mrk lk","f":"جَلَسُوا","a":"Mereka lk telah duduk"},
    {"d":"هِيَ","l":"Dia pr","f":"جَلَسَتْ","a":"Dia pr telah duduk"},
    {"d":"هُمَا","l":"Mrk 2 pr","f":"جَلَسَتَا","a":"Mrk berdua pr telah duduk"},
    {"d":"هُنَّ","l":"Mrk pr","f":"جَلَسْنَ","a":"Mereka pr telah duduk"},
    {"d":"أَنْتَ","l":"Kamu lk","f":"جَلَسْتَ","a":"Kamu lk telah duduk"},
    {"d":"أَنْتُمَا","l":"Klia 2 lk","f":"جَلَسْتُمَا","a":"Kalian 2 lk telah duduk"},
    {"d":"أَنْتُمْ","l":"Klia lk","f":"جَلَسْتُمْ","a":"Kalian lk telah duduk"},
    {"d":"أَنْتِ","l":"Kamu pr","f":"جَلَسْتِ","a":"Kamu pr telah duduk"},
    {"d":"أَنْتُمَا","l":"Klia 2 pr","f":"جَلَسْتُمَا","a":"Kalian 2 pr telah duduk"},
    {"d":"أَنْتُنَّ","l":"Klia pr","f":"جَلَسْتُنَّ","a":"Kalian pr telah duduk"},
    {"d":"أَنَا","l":"Saya","f":"جَلَسْتُ","a":"Saya telah duduk"},
    {"d":"نَحْنُ","l":"Kami","f":"جَلَسْنَا","a":"Kami telah duduk"}
  ],
  "mudhari": [
    {"d":"هُوَ","l":"Dia lk","f":"يَجْلِسُ","a":"Dia lk sedang duduk"},
    {"d":"هُمَا","l":"Mrk 2 lk","f":"يَجْلِسَانِ","a":"Mrk berdua lk sedang duduk"},
    {"d":"هُمْ","l":"Mrk lk","f":"يَجْلِسُونَ","a":"Mereka lk sedang duduk"},
    {"d":"هِيَ","l":"Dia pr","f":"تَجْلِسُ","a":"Dia pr sedang duduk"},
    {"d":"هُمَا","l":"Mrk 2 pr","f":"تَجْلِسَانِ","a":"Mrk berdua pr sedang duduk"},
    {"d":"هُنَّ","l":"Mrk pr","f":"يَجْلِسْنَ","a":"Mereka pr sedang duduk"},
    {"d":"أَنْتَ","l":"Kamu lk","f":"تَجْلِسُ","a":"Kamu lk sedang duduk"},
    {"d":"أَنْتُمَا","l":"Klia 2 lk","f":"تَجْلِسَانِ","a":"Kalian 2 lk sedang duduk"},
    {"d":"أَنْتُمْ","l":"Klia lk","f":"تَجْلِسُونَ","a":"Kalian lk sedang duduk"},
    {"d":"أَنْتِ","l":"Kamu pr","f":"تَجْلِسِينَ","a":"Kamu pr sedang duduk"},
    {"d":"أَنْتُمَا","l":"Klia 2 pr","f":"تَجْلِسَانِ","a":"Kalian 2 pr sedang duduk"},
    {"d":"أَنْتُنَّ","l":"Klia pr","f":"تَجْلِسْنَ","a":"Kalian pr sedang duduk"},
    {"d":"أَنَا","l":"Saya","f":"أَجْلِسُ","a":"Saya sedang duduk"},
    {"d":"نَحْنُ","l":"Kami","f":"نَجْلِسُ","a":"Kami sedang duduk"}
  ],
  "amr": [
    {"d":"أَنْتَ","l":"Kamu lk","f":"اِجْلِسْ","a":"Duduklah! (lk)"},
    {"d":"أَنْتُمَا","l":"Klia 2 lk","f":"اِجْلِسَا","a":"Duduklah! (2 lk)"},
    {"d":"أَنْتُمْ","l":"Klia lk","f":"اِجْلِسُوا","a":"Duduklah! (klia lk)"},
    {"d":"أَنْتِ","l":"Kamu pr","f":"اِجْلِسِي","a":"Duduklah! (pr)"},
    {"d":"أَنْتُمَا","l":"Klia 2 pr","f":"اِجْلِسَا","a":"Duduklah! (2 pr)"},
    {"d":"أَنْتُنَّ","l":"Klia pr","f":"اِجْلِسْنَ","a":"Duduklah! (klia pr)"}
  ]
}

JSON only.`;
    }
};
