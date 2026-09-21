/**
 * PROMPTS.JS - AI Prompts
 * Tashrif AI
 */

'use strict';

const Prompts = {
    /**
     * Istilahi prompt
     */
    istilahi(query) {
        return `Anda ahli nahwu-sharaf. Pentashrif kata Arab.
Analisis kata "${query}" dan berikan tashrif istilahi-nya.

WAJIB: Respons HANYA JSON valid tanpa markdown.
Format JSON untuk كَتَبَ:
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
    {"label":"Isim Maf'ul","wazan":"مَفْعُوْلٌ","mauzun":"مَكْتُوْبٌ","arti":"Yang ditulis"},
    {"label":"Fi'il Amr","wazan":"اُفْعُلْ","mauzun":"اُكْتُبْ","arti":"Menulislah!"},
    {"label":"Fi'il Nahi","wazan":"لَا تَفْعُلْ","mauzun":"لَا تَكْتُبْ","arti":"Jangan menulis!"},
    {"label":"Isim Zaman/Makan","wazan":"مَفْعَلٌ","mauzun":"مَكْتَبٌ","arti":"Tempat menulis"},
    {"label":"Isim Alat","wazan":"مِفْعَلٌ","mauzun":"مِكْتَبٌ","arti":"Alat menulis"}
  ]
}

Buat JSON untuk kata "${query}" dengan data sebenarnya.`;
    },

    /**
     * Lughawi prompt
     */
    lughawi(query, arabic) {
        return `Buat tashrif lughawi lengkap untuk "${query}" (${arabic}).
WAJIB: JSON valid saja.

Contoh untuk كَتَبَ:
{
  "madhi":[
    {"d":"هُوَ","l":"Dia lk","f":"كَتَبَ","a":"Dia lk telah menulis"},
    {"d":"هُمَا","l":"Mrk 2 lk","f":"كَتَبَا","a":"Mrk berdua lk telah menulis"},
    {"d":"هُمْ","l":"Mrk lk","f":"كَتَبُوْا","a":"Mereka lk telah menulis"},
    {"d":"هِيَ","l":"Dia pr","f":"كَتَبَتْ","a":"Dia pr telah menulis"},
    {"d":"هُمَا","l":"Mrk 2 pr","f":"كَتَبَتَا","a":"Mrk berdua pr telah menulis"},
    {"d":"هُنَّ","l":"Mrk pr","f":"كَتَبْنَ","a":"Mereka pr telah menulis"},
    {"d":"أَنْتَ","l":"Kamu lk","f":"كَتَبْتَ","a":"Kamu lk telah menulis"},
    {"d":"أَنْتُمَا","l":"Klia 2 lk","f":"كَتَبْتُمَا","a":"Kalian 2 lk telah menulis"},
    {"d":"أَنْتُمْ","l":"Klia lk","f":"كَتَبْتُمْ","a":"Kalian lk telah menulis"},
    {"d":"أَنْتِ","l":"Kamu pr","f":"كَتَبْتِ","a":"Kamu pr telah menulis"},
    {"d":"أَنْتُمَا","l":"Klia 2 pr","f":"كَتَبْتُمَا","a":"Kalian 2 pr telah menulis"},
    {"d":"أَنْتُنَّ","l":"Klia pr","f":"كَتَبْتُنَّ","a":"Kalian pr telah menulis"},
    {"d":"أَنَا","l":"Saya","f":"كَتَبْتُ","a":"Saya telah menulis"},
    {"d":"نَحْنُ","l":"Kami","f":"كَتَبْنَا","a":"Kami telah menulis"}
  ],
  "mudhari":[
    {"d":"هُوَ","l":"Dia lk","f":"يَكْتُبُ","a":"Dia lk sedang menulis"},
    {"d":"هُمَا","l":"Mrk 2 lk","f":"يَكْتُبَانِ","a":"Mrk berdua lk sedang menulis"},
    {"d":"هُمْ","l":"Mrk lk","f":"يَكْتُبُوْنَ","a":"Mereka lk sedang menulis"},
    {"d":"هِيَ","l":"Dia pr","f":"تَكْتُبُ","a":"Dia pr sedang menulis"},
    {"d":"هُمَا","l":"Mrk 2 pr","f":"تَكْتُبَانِ","a":"Mrk berdua pr sedang menulis"},
    {"d":"هُنَّ","l":"Mrk pr","f":"يَكْتُبْنَ","a":"Mereka pr sedang menulis"},
    {"d":"أَنْتَ","l":"Kamu lk","f":"تَكْتُبُ","a":"Kamu lk sedang menulis"},
    {"d":"أَنْتُمَا","l":"Klia 2 lk","f":"تَكْتُبَانِ","a":"Kalian 2 lk sedang menulis"},
    {"d":"أَنْتُمْ","l":"Klia lk","f":"تَكْتُبُوْنَ","a":"Kalian lk sedang menulis"},
    {"d":"أَنْتِ","l":"Kamu pr","f":"تَكْتُبِيْنَ","a":"Kamu pr sedang menulis"},
    {"d":"أَنْتُمَا","l":"Klia 2 pr","f":"تَكْتُبَانِ","a":"Kalian 2 pr sedang menulis"},
    {"d":"أَنْتُنَّ","l":"Klia pr","f":"تَكْتُبْنَ","a":"Kalian pr sedang menulis"},
    {"d":"أَنَا","l":"Saya","f":"أَكْتُبُ","a":"Saya sedang menulis"},
    {"d":"نَحْنُ","l":"Kami","f":"نَكْتُبُ","a":"Kami sedang menulis"}
  ],
  "amr":[
    {"d":"أَنْتَ","l":"Kamu lk","f":"اُكْتُبْ","a":"Menulislah! lk"},
    {"d":"أَنْتُمَا","l":"Klia 2 lk","f":"اُكْتُبَا","a":"Menulislah! 2 lk"},
    {"d":"أَنْتُمْ","l":"Klia lk","f":"اُكْتُبُوْا","a":"Menulislah! klia lk"},
    {"d":"أَنْتِ","l":"Kamu pr","f":"اُكْتُبِيْ","a":"Menulislah! pr"},
    {"d":"أَنْتُمَا","l":"Klia 2 pr","f":"اُكْتُبَا","a":"Menulislah! 2 pr"},
    {"d":"أَنْتُنَّ","l":"Klia pr","f":"اُكْتُبْنَ","a":"Menulislah! klia pr"}
  ]
}

Buat JSON untuk "${query}".`;
    }
};
