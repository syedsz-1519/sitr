import { ReflectionPrompt } from '../types';

export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  {
    id: 'ref-1',
    quote: {
      arabic: 'حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا',
      text: 'Hold yourselves accountable before you are held accountable, and weigh your deeds before they are weighed for you.',
      source: 'Sayyiduna Umar ibn al-Khattab (RA) • Kitab az-Zuhd',
      category: 'muhasabah',
    },
    question: 'As this day closes, how did you guard your eyes, heart, and thoughts when you were alone?',
    subtext: 'Consider the quiet moments with your phone or screen — where did your heart turn when nobody was watching?',
  },
  {
    id: 'ref-2',
    quote: {
      arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ',
      text: 'O you who have believed, fear Allah. And let every soul look to what it has put forth for tomorrow...',
      source: 'Surah Al-Hashr • 59:18',
      category: 'muhasabah',
    },
    question: 'What seeds of goodness or patience did you plant today for your Akhirah?',
    subtext: 'Even withholding a glance or taking a deep breath of Astaghfirullah is a heavy weight on your scale.',
  },
  {
    id: 'ref-3',
    quote: {
      arabic: 'إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الأُولَى',
      text: 'True patience (Sabr) is at the very first stroke of temptation or difficulty.',
      source: 'Sahih al-Bukhari 1283',
      category: 'sabr',
    },
    question: 'What moment tested your patience or discipline today, and what helped you overcome the impulse?',
    subtext: 'Reflect on the immediate physical or emotional trigger: boredom, fatigue, loneliness, or curiosity?',
  },
  {
    id: 'ref-4',
    quote: {
      arabic: 'مَنْ تَرَكَ شَيْئًا لِلَّهِ عَوَّضَهُ اللَّهُ خَيْرًا مِنْهُ',
      text: 'Whoever leaves something for the sake of Allah, Allah will replace it with something far better.',
      source: 'Musnad Ahmad 23074',
      category: 'istiqamah',
    },
    question: 'What distraction or temporary desire did you walk away from today for Allah’s sake?',
    subtext: 'Notice the quiet serenity (sakinah) that settles in the chest whenever you close a door to haram.',
  },
  {
    id: 'ref-5',
    quote: {
      arabic: 'إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ',
      text: 'Indeed, good deeds wipe out bad deeds. That is a reminder for those who remember.',
      source: 'Surah Hud • 11:114',
      category: 'tawbah',
    },
    question: 'If you felt any slip or spiritual heaviness today, what sincere act of Tawbah or dhikr did you offer to purify it?',
    subtext: 'Never let Shaytan whisper that you are unworthy of returning. The door of Tawbah is wider than the heavens.',
  },
  {
    id: 'ref-6',
    quote: {
      arabic: 'أَلاَ بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
      text: 'Unquestionably, by the remembrance of Allah do hearts find rest.',
      source: 'Surah Ar-Ra’d • 13:28',
      category: 'gratitude',
    },
    question: 'Which prayer or moment of Dhikr brought your soul genuine stillness and peace today?',
    subtext: 'Recall the feeling of bowing or whispering SubhanAllah — how can you recreate that presence tomorrow?',
  },
  {
    id: 'ref-7',
    quote: {
      arabic: 'الْمُؤْمِنُ قَوَّامٌ عَلَى نَفْسِهِ، يُحَاسِبُ نَفْسَهُ لِلَّهِ عَزَّ وَجَلَّ',
      text: 'The true believer is a steadfast guardian over his soul; he holds his nafs to account purely for Allah.',
      source: 'Al-Hasan al-Basri • Hilyat al-Awliya',
      category: 'muhasabah',
    },
    question: 'What was your primary emotional state today, and how did it influence your digital habits?',
    subtext: 'Were you seeking comfort, distraction, or validation through screens? How can your heart find that comfort in Allah instead?',
  },
  {
    id: 'ref-8',
    quote: {
      arabic: 'وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا',
      text: 'And if you were to count the blessings of Allah, you could never enumerate them.',
      source: 'Surah Ibrahim • 14:34',
      category: 'gratitude',
    },
    question: 'What are three unexpected mercies or quiet blessings you received today that you did not pay for or ask for?',
    subtext: 'Physical health, clean eyes, peace in your home, a supportive brother, or the ability to recite His words.',
  },
  {
    id: 'ref-9',
    quote: {
      arabic: 'مَنْ تَطَهَّرَ فِي بَيْتِهِ ثُمَّ مَشَى إِلَى بَيْتٍ مِنْ بُيُوتِ اللَّهِ',
      text: 'Whoever purifies himself in his house then walks to one of the houses of Allah to perform an obligatory prayer...',
      source: 'Sahih Muslim 666',
      category: 'istiqamah',
    },
    question: 'Did you honor your five daily prayers on time today? Which prayer felt most transformative?',
    subtext: 'Reflect on whether Fajr set the tone of vigilance, or if Asr/Isha brought the day to a protected close.',
  },
  {
    id: 'ref-10',
    quote: {
      text: 'The soul is like a stubborn trade partner: if you do not demand an audit every night, it will run away with all your capital.',
      source: 'Imam Ibn al-Qayyim • Madarij as-Salikin',
      category: 'muhasabah',
    },
    question: 'What is one concrete habit or boundary you intend to reinforce tomorrow to protect your modesty and time?',
    subtext: 'e.g., placing the phone across the room before bed, starting morning dhikr before opening apps, or walking away when triggers appear.',
  },
  {
    id: 'ref-11',
    quote: {
      arabic: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا',
      text: 'And those who strive for Us — We will surely guide them to Our ways. And indeed, Allah is with the doers of good.',
      source: 'Surah Al-Ankabut • 29:69',
      category: 'istiqamah',
    },
    question: 'Where did you feel Allah’s subtle assistance and protection (Sitr) when you were on the brink of faltering?',
    subtext: 'Recognize that your ability to say no to haram is not just your strength, but Allah shielding your honor.',
  },
  {
    id: 'ref-12',
    quote: {
      arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
      text: 'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins."',
      source: 'Surah Az-Zumar • 39:53',
      category: 'tawbah',
    },
    question: 'Are you carrying any self-condemnation tonight? What does Allah’s unconditional promise of mercy mean to you right now?',
    subtext: 'Breathe out despair. Make sincere istighfar, make wudu, and enter the night with a cleansed slate.',
  },
];

/**
 * Returns today's featured prompt based on date seed, ensuring every day has a purposeful question.
 */
export function getDailyPrompt(dateStr?: string): ReflectionPrompt {
  const date = dateStr ? new Date(dateStr) : new Date();
  // Simple day-of-year hash
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = Math.abs(dayOfYear) % REFLECTION_PROMPTS.length;
  return REFLECTION_PROMPTS[index];
}
