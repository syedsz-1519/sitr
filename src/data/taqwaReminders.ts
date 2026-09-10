import { TaqwaReminderItem, ReminderContentType } from '../types';

export const TAQWA_REMINDERS: TaqwaReminderItem[] = [
  // Quranic Reflections
  {
    id: 'quran-1',
    title: 'Divine Vigilance (Muraqabah)',
    arabic: 'أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَىٰ',
    text: 'Does he not know that Allah sees?',
    source: 'Surah Al-Alaq (96:14)',
    type: 'quran',
    category: 'Muraqabah',
  },
  {
    id: 'quran-2',
    title: 'Closer Than Your Jugular Vein',
    arabic: 'وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
    text: 'And We have already created man and know what his soul whispers to him, and We are closer to him than his jugular vein.',
    source: 'Surah Qaf (50:16)',
    type: 'quran',
    category: 'Inner Accountability',
  },
  {
    id: 'quran-3',
    title: 'Guarding the Gaze',
    arabic: 'قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ذَٰلِكَ أَزْكَىٰ لَهُمْ إِنَّ اللَّهَ خَبِيرٌ بِمَا يَصْنَعُونَ',
    text: 'Tell the believing men to lower their gaze and guard their modesty; that is purer for them. Indeed, Allah is Acquainted with what they do.',
    source: 'Surah An-Nur (24:30)',
    type: 'quran',
    category: 'Modesty (Haya)',
  },
  {
    id: 'quran-4',
    title: 'He is With You Everywhere',
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ',
    text: 'And He is with you wherever you are. And Allah is Seeing of what you do.',
    source: 'Surah Al-Hadid (57:4)',
    type: 'quran',
    category: 'Taqwa',
  },
  {
    id: 'quran-5',
    title: 'The Way Out for Those With Taqwa',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    text: 'And whoever fears Allah — He will make for him a way out, and will provide for him from where he does not expect.',
    source: 'Surah At-Talaq (65:2-3)',
    type: 'quran',
    category: 'Hope & Reliance',
  },
  {
    id: 'quran-6',
    title: 'Striving for Allah’s Countenance',
    arabic: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ',
    text: 'And those who strive for Us — We will surely guide them to Our ways. And indeed, Allah is with the doers of good.',
    source: 'Surah Al-Ankabut (29:69)',
    type: 'quran',
    category: 'Jihad an-Nafs',
  },
  {
    id: 'quran-7',
    title: 'Seek Help Through Sabr & Salah',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    text: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
    source: 'Surah Al-Baqarah (2:153)',
    type: 'quran',
    category: 'Patience & Prayer',
  },
  {
    id: 'quran-8',
    title: 'What Have You Put Forth for Tomorrow?',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ',
    text: 'O you who have believed, fear Allah. And let every soul look to what it has put forth for tomorrow...',
    source: 'Surah Al-Hashr (59:18)',
    type: 'quran',
    category: 'Self-Audit',
  },

  // Taqwa & Heart Inspirations
  {
    id: 'taqwa-1',
    title: 'The Sweetness of Resisting Urges',
    text: 'Patience with urges is far easier and sweeter than enduring the bitter regret and spiritual numbness of sin.',
    source: 'Imam Ibn al-Qayyim • Al-Fawa’id',
    type: 'taqwa',
    category: 'Restraint',
  },
  {
    id: 'taqwa-2',
    title: 'The Essence of Taqwa',
    text: 'Taqwa is fearing the Almighty with reverence, acting in obedience upon Revelation, being content with little, and preparing with vigilance for the Day of Departure.',
    source: 'Sayyiduna Ali ibn Abi Talib (RA)',
    type: 'taqwa',
    category: 'Definition of Taqwa',
  },
  {
    id: 'taqwa-3',
    title: 'When You Are in Seclusion',
    text: 'When you are alone behind closed doors and your soul invites you to transgress, feel shame before Allah and remind yourself: "The One who created darkness sees me in the dark."',
    source: 'Imam Ahmad ibn Hanbal',
    type: 'taqwa',
    category: 'Secret Modesty',
  },
  {
    id: 'taqwa-4',
    title: 'The Inner Warner',
    text: 'A servant remains in steadfast goodness as long as he possesses an honest warner within his conscience and self-reckoning is his nightly practice.',
    source: 'Al-Hasan al-Basri • Hilyat al-Awliya',
    type: 'taqwa',
    category: 'Conscience',
  },
  {
    id: 'taqwa-5',
    title: 'The True Mujahid',
    arabic: 'الْمُجَاهِدُ مَنْ جَاهَدَ نَفْسَهُ فِي اللَّهِ',
    text: 'The true warrior (Mujahid) is the one who strives earnestly against his own desires and lower self for the sake of Allah.',
    source: 'Prophet Muhammad ﷺ • Jami` at-Tirmidhi 1621',
    type: 'taqwa',
    category: 'Spiritual Struggle',
  },
  {
    id: 'taqwa-6',
    title: 'Leaving Sins for Allah',
    arabic: 'مَنْ تَرَكَ شَيْئًا لِلَّهِ عَوَّضَهُ اللَّهُ خَيْرًا مِنْهُ',
    text: 'Whoever leaves something for the sake of Allah, Allah replaces it in their heart with a sweetness and light far greater than what was left behind.',
    source: 'Musnad Ahmad 23074',
    type: 'taqwa',
    category: 'Divine Compensation',
  },
  {
    id: 'taqwa-7',
    title: 'Look at the Greatness of Allah',
    text: 'Do not measure the smallness of the glance or the click; rather, look at the immense Majesty of the Lord before whom your heart stands exposed.',
    source: 'Bilal ibn Sa’d (RA)',
    type: 'taqwa',
    category: 'Reverence',
  },
  {
    id: 'taqwa-8',
    title: 'Light of the Heart',
    text: 'Whoever closes their eyes to what Allah has forbidden, Allah will illuminate their spiritual insight (firasa) and fill their chest with quiet tranquility.',
    source: 'Imam Ibn al-Qayyim • Rawdat al-Muhibbin',
    type: 'taqwa',
    category: 'Spiritual Vision',
  },
];

/**
 * Returns a scheduled reminder for today based on day of year seed and preferred content type
 */
export function getDailyScheduledReminder(
  contentType: ReminderContentType = 'both',
  dateStr?: string
): TaqwaReminderItem {
  const date = dateStr ? new Date(dateStr) : new Date();
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  let pool = TAQWA_REMINDERS;
  if (contentType === 'taqwa') {
    pool = TAQWA_REMINDERS.filter((item) => item.type === 'taqwa');
  } else if (contentType === 'quran') {
    pool = TAQWA_REMINDERS.filter((item) => item.type === 'quran');
  }

  if (pool.length === 0) pool = TAQWA_REMINDERS;

  const index = Math.abs(dayOfYear) % pool.length;
  return pool[index];
}

/**
 * Returns a random reminder matching optional type filter
 */
export function getRandomReminder(contentType: ReminderContentType = 'both'): TaqwaReminderItem {
  let pool = TAQWA_REMINDERS;
  if (contentType === 'taqwa') {
    pool = TAQWA_REMINDERS.filter((item) => item.type === 'taqwa');
  } else if (contentType === 'quran') {
    pool = TAQWA_REMINDERS.filter((item) => item.type === 'quran');
  }

  if (pool.length === 0) pool = TAQWA_REMINDERS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
