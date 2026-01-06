import React, { useState } from 'react';
import { Heart, Search, Copy, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLocalStorage } from '../hooks/useLocalStorage';

const duas = [
  {
    id: 1,
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    english: "Praise is to Allah Who has given me this food and sustained me with it though I was unable to do it and had no power.",
    category: "After Eating",
    reference: "Tirmidhi"
  },
  {
    id: 2,
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    english: "Praise is to Allah Who has clothed me with this and provided it for me without any might or power on my part.",
    category: "When Wearing Clothes",
    reference: "Abu Dawud"
  },
  {
    id: 3,
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    english: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    category: "Leaving Home",
    reference: "Tirmidhi"
  },
  {
    id: 4,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ، وَقَهْرِ الرِّجَالِ",
    english: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and being overpowered by men.",
    category: "Anxiety and Sorrow",
    reference: "Bukhari"
  },
  {
    id: 5,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    english: "Our Lord, grant us good in this world and good in the Hereafter, and save us from the punishment of the Fire.",
    category: "Comprehensive Dua",
    reference: "Quran 2:201"
  },
  {
    id: 6,
    arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ",
    english: "O Allah, guide me among those You have guided, pardon me among those You have pardoned, protect me among those You have protected, bless me in what You have given, and keep me away from the evil of what You have decreed. Indeed, You decree and none can decree over You.",
    category: "Qunoot",
    reference: "Tirmidhi"
  },
  {
    id: 7,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى، وَالْعَفَافَ وَالْغِنَى",
    english: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.",
    category: "Daily Supplication",
    reference: "Muslim"
  },
  {
    id: 8,
    arabic: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي",
    english: "O Allah, correct my religion which is the safeguard of my affairs, correct my worldly affairs wherein is my livelihood, and correct my Hereafter wherein is my return.",
    category: "Comprehensive Dua",
    reference: "Muslim"
  },
  {
    id: 9,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    english: "Glory is to Allah and praise is to Him, by the number of His creation, by His pleasure, by the weight of His Throne, and by the ink of His words.",
    category: "Morning and Evening",
    reference: "Muslim"
  },
  {
    id: 10,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    english: "O Allah, I seek refuge in You from the punishment of the grave, from the punishment of Hellfire, from the trials of life and death, and from the evil of the trials of the False Messiah.",
    category: "Protection",
    reference: "Bukhari"
  },
  {
    id: 11,
    arabic: "اللَّهُمَّ بَارِكْ لَهُمْ فِي مَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ",
    english: "O Allah, bless them in what You have provided for them, and forgive them and have mercy on them.",
    category: "For Others",
    reference: "Muslim"
  },
  {
    id: 12,
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    english: "My Lord, increase me in knowledge.",
    category: "Knowledge",
    reference: "Quran 20:114"
  },
  {
    id: 13,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    english: "O Allah, I ask You for beneficial knowledge, good provision, and acceptable deeds.",
    category: "Daily Supplication",
    reference: "Ibn Majah"
  },
  {
    id: 14,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ",
    english: "O Allah, I seek refuge in You from the disappearance of Your blessings, the loss of Your protection, the suddenness of Your punishment, and all of Your displeasure.",
    category: "Protection",
    reference: "Muslim"
  },
  {
    id: 15,
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    english: "O Allah, help me to remember You, thank You, and worship You in the best manner.",
    category: "Worship",
    reference: "Abu Dawud"
  },
  {
    id: 16,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    english: "O Allah, I ask You for Paradise and seek refuge in You from the Fire.",
    category: "Afterlife",
    reference: "Ibn Majah"
  },
  {
    id: 17,
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ",
    english: "O Allah, forgive me all my sins, small and large, first and last, open and secret.",
    category: "Forgiveness",
    reference: "Muslim"
  },
  {
    id: 18,
    arabic: "اللَّهُمَّ طَهِّرْ قَلْبِي مِنَ النِّفَاقِ، وَعَمَلِي مِنَ الرِّيَاءِ، وَلِسَانِي مِنَ الْكَذِبِ، وَعَيْنِي مِنَ الْخِيَانَةِ",
    english: "O Allah, purify my heart from hypocrisy, my deeds from showing off, my tongue from lying, and my eyes from betrayal.",
    category: "Purity",
    reference: "Bayhaqi"
  },
  {
    id: 19,
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    english: "O Allah, there is no ease except what You make easy, and You make the difficult easy if You wish.",
    category: "Difficulties",
    reference: "Ibn Hibban"
  },
  {
    id: 20,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مُحَبَّتَكَ وَمُحَبَّةَ مَنْ يُحِبُّكَ، وَمُحَبَّةَ عَمَلٍ يُقَرِّبُنِي إِلَى مَحَبَّتِكَ",
    english: "O Allah, I ask You for Your love, the love of those who love You, and the love of deeds that bring me closer to Your love.",
    category: "Love",
    reference: "Tirmidhi"
  },
  {
    id: 21,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الرَّاحَةَ عِنْدَ الْمَوْتِ، وَالْعَفْوَ عِنْدَ الْحِسَابِ",
    english: "O Allah, I ask You for ease at the time of death and forgiveness at the time of reckoning.",
    category: "Death",
    reference: "Tirmidhi"
  },
  {
    id: 22,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْفَوْزَ بِالْجَنَّةِ، وَالنَّجَاةَ مِنَ النَّارِ",
    english: "O Allah, I ask You for success in attaining Paradise and salvation from the Fire.",
    category: "Afterlife",
    reference: "Ibn Majah"
  },
  {
    id: 23,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ كُلِّ دَابَّةٍ أَنْتَ آخِذٌ بِنَاصِيَتِهَا",
    english: "O Allah, I seek refuge in You from the evil of myself and from the evil of every creature You grasp by its forelock.",
    category: "Protection",
    reference: "Tirmidhi"
  },
  {
    id: 24,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عَافِيَةً فِي الدُّنْيَا وَالْآخِرَةِ",
    english: "O Allah, I ask You for well-being in this world and the Hereafter.",
    category: "Well-being",
    reference: "Ibn Majah"
  },
  {
    id: 25,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    english: "O Allah, I ask You for forgiveness and well-being in this world and the Hereafter.",
    category: "Well-being",
    reference: "Abu Dawud"
  },
  {
    id: 26,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ حُبَّكَ، وَحُبَّ مَنْ يُحِبُّكَ، وَحُبَّ عَمَلٍ يُقَرِّبُنِي إِلَى حُبِّكَ",
    english: "O Allah, I ask You for Your love, the love of those who love You, and the love of deeds that bring me closer to Your love.",
    category: "Love",
    reference: "Tirmidhi"
  },
  {
    id: 27,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ، عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ",
    english: "O Allah, I ask You for all good, both immediate and delayed, what I know of it and what I do not know.",
    category: "Comprehensive",
    reference: "Ibn Majah"
  },
  {
    id: 28,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنْ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ",
    english: "O Allah, I seek refuge in You from miserliness, and I seek refuge in You from cowardice, and I seek refuge in You from being returned to the worst of old age.",
    category: "Protection",
    reference: "Bukhari"
  },
  {
    id: 29,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    english: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.",
    category: "Daily",
    reference: "Muslim"
  },
  {
    id: 30,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا",
    english: "O Allah, I seek refuge in You from knowledge that does not benefit, from a heart that is not humble, from a soul that is not satisfied, and from a supplication that is not answered.",
    category: "Protection",
    reference: "Muslim"
  }
];

export function Duas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useLocalStorage('favorite-duas', [] as number[]);

  const filteredDuas = duas.filter(dua =>
    dua.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dua.arabic.includes(searchTerm) ||
    dua.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Islamic Supplications (Duas)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Collection of authentic duas from Quran and Sunnah
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search duas by text or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDuas.map((dua) => (
          <Card key={dua.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {dua.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    Dua #{dua.id}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(dua.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(dua.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${dua.arabic}\n\n${dua.english}`, dua.id)}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {copiedId === dua.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-right leading-loose text-lg font-arabic" dir="rtl">
                  {dua.arabic}
                </div>
                
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {dua.english}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <strong>Reference:</strong> {dua.reference}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDuas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No duas found matching your search.</p>
        </div>
      )}
    </div>
  );
}