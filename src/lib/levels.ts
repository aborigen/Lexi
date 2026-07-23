export interface WordLevel {
  letters: string[];
  validWords: string[];
  lang: 'en' | 'ru';
  hints: Record<string, string>;
}

export const LEVELS: WordLevel[] = [
  {
    lang: 'ru',
    letters: ['П', 'И', 'Л', 'О', 'Т'],
    validWords: ['ПИЛОТ', 'ПОЛ', 'ЛОТ', 'ТИП', 'ПОТ', 'ТОП'],
    hints: {
      'ПИЛОТ': 'Главный _____ корабля уверенно вел судно через бурю.',
      'ПОЛ': 'В комнате был идеально ровный деревянный _____.',
      'ЛОТ': 'Этот ценный _____ был продан на аукционе за миллион.',
      'ТИП': 'Он был довольно странный _____, всегда в черной шляпе.',
      'ПОТ': 'Тяжелый труд и _____ принесли свои плоды.',
      'ТОП': 'Её песня быстро взлетела в _____ музыкальных чартов.'
    }
  },
  { 
    lang: 'en',
    letters: ['S', 'T', 'A', 'R', 'E'], 
    validWords: ['STAR', 'STARE', 'TEAR', 'RATE', 'ERA', 'ART', 'EAT', 'TEA', 'ARE', 'REST', 'EAST', 'SEAT'],
    hints: {
      'STAR': 'Look up at the night sky and find the brightest _____.',
      'STARE': 'It is impolite to _____ at people for too long.',
      'TEAR': 'A single _____ rolled down her cheek as she read the letter.',
      'RATE': 'The interest _____ has increased significantly this year.',
      'ERA': 'We are living in a new digital _____ of innovation.',
      'ART': 'Life is short, but _____ is long and eternal.',
      'EAT': 'You are what you _____, so choose healthy food.',
      'TEA': 'Would you like a cup of hot _____ with lemon?',
      'ARE': 'Where _____ you going so late in the evening?',
      'REST': 'After a long walk, they decided to _____ by the river.',
      'EAST': 'The sun rises in the _____ and sets in the west.',
      'SEAT': 'Please take your _____ and fasten your belt.'
    }
  },
  { 
    lang: 'en',
    letters: ['P', 'L', 'A', 'T', 'E'], 
    validWords: ['PLATE', 'LEAP', 'PALE', 'PLEA', 'TALE', 'APE', 'TAP', 'TEA', 'EAT', 'PET', 'LET'],
    hints: {
      'PLATE': 'She served the main course on a large ceramic _____.',
      'LEAP': 'One small step for man, one giant _____ for mankind.',
      'PALE': 'The moon looked _____ in the morning sky.',
      'PLEA': 'The prisoner made a final _____ for mercy.',
      'TALE': 'It was a classic _____ of mystery and adventure.',
      'APE': 'The great _____ climbed the tree with incredible speed.',
      'TAP': 'Please _____ the screen to start the game.',
      'TEA': 'Freshly brewed _____ smells wonderful in the morning.',
      'EAT': 'Let\'s go out to _____ at that new Italian restaurant.',
      'PET': 'The little girl asked for a _____ rabbit for her birthday.',
      'LET': '_____ the sunshine in and open the windows.'
    }
  },
  { 
    lang: 'en',
    letters: ['B', 'R', 'E', 'A', 'D'], 
    validWords: ['BREAD', 'BEAD', 'BARE', 'BEAR', 'READ', 'DEAR', 'RED', 'BED', 'BAD', 'ARE', 'ERA'],
    hints: {
      'BREAD': 'Give us this day our daily _____.',
      'BEAD': 'A single glass _____ fell from her broken necklace.',
      'BARE': 'The winter trees stood _____ against the cold sky.',
      'BEAR': 'A large brown _____ was spotted near the campsite.',
      'READ': 'I like to _____ books before going to sleep.',
      'DEAR': 'The letter started with "_____ Friend," which was nice.',
      'RED': 'The autumn leaves turned a beautiful shade of _____.',
      'BED': 'It was late, and he was finally ready for _____.',
      'BAD': 'Don\'t feel _____ about things you cannot change.',
      'ARE': 'How _____ you feeling today?',
      'ERA': 'The Victorian _____ was a time of great change.'
    }
  },
  { 
    lang: 'en',
    letters: ['C', 'L', 'O', 'U', 'D'], 
    validWords: ['CLOUD', 'LOUD', 'COLD', 'DOC', 'OLD', 'Duo', 'COULD'],
    hints: {
      'CLOUD': 'Every _____ has a silver lining, as they say.',
      'LOUD': 'The music was so _____ the windows started to vibrate.',
      'COLD': 'Winter mornings are often very _____ and frosty.',
      'DOC': 'The _____ told him to take two pills and rest.',
      'OLD': 'They found an _____ map hidden in the attic.',
      'DUO': 'The famous musical _____ performed their latest hit.',
      'COULD': 'I wish I _____ fly like a bird in the sky.'
    }
  },
  {
    lang: 'ru',
    letters: ['К', 'О', 'М', 'А', 'Р'],
    validWords: ['КОМАР', 'КОРА', 'КОМА', 'МАК', 'РОК', 'РОМ'],
    hints: {
      'КОМАР': 'Маленький _____ жужжал над ухом всю ночь.',
      'КОРА': 'Толстая _____ дуба защищает его от холода.',
      'КОМА': 'После аварии пациент впал в состояние _____.',
      'МАК': 'В поле рос яркий красный _____.',
      'РОК': 'Это был злой _____, преследовавший их семью.',
      'РОМ': 'Пираты всегда предпочитали крепкий _____.'
    }
  },
  {
    lang: 'ru',
    letters: ['К', 'Н', 'И', 'Г', 'А'],
    validWords: ['КНИГА', 'НИКА', 'КИНА', 'ГИКА'],
    hints: {
      'КНИГА': 'Хорошая _____ — лучший подарок для друга.',
      'НИКА': 'Древнегреческая богиня победы звалась _____.',
      'КИНА': 'В этой деревне давно не показывали нового _____.',
      'ГИКА': 'Раздался резкий звук _____ индейского воина.'
    }
  },
  {
    lang: 'ru',
    letters: ['М', 'О', 'Р', 'Е'],
    validWords: ['МОРЕ', 'РОМ', 'МОР'],
    hints: {
      'МОРЕ': '_____ волновалось раз, _____ волновалось два...',
      'РОМ': 'Йо-хо-хо, и бутылка _____!',
      'МОР': 'В те времена по городам гулял страшный _____.'
    }
  },
  {
    lang: 'ru',
    letters: ['П', 'О', 'Е', 'З', 'Д'],
    validWords: ['ПОЕЗД', 'ДЕПО', 'ПОД', 'ДОЗ'],
    hints: {
      'ПОЕЗД': 'Наш _____ летит вперед, в коммуне остановка.',
      'ДЕПО': 'Трамваи на ночь уезжают в городское _____.',
      'ПОД': 'Книга упала прямо _____ стол.',
      'ДОЗ': 'Врач выписал лекарство, состоящее из нескольких _____.'
    }
  },
  {
    lang: 'ru',
    letters: ['С', 'П', 'О', 'Р', 'Т'],
    validWords: ['СПОРТ', 'ПОРТ', 'СПОР', 'ТРОС', 'СОРТ', 'РОТ', 'СТО', 'ПОТ', 'ТОП'],
    hints: {
      'СПОРТ': 'О _____, ты — мир!',
      'ПОРТ': 'Корабль наконец вошел в родной _____.',
      'СПОР': 'В этом жарком _____ родилась истина.',
      'ТРОС': 'Стальной _____ натянулся до предела.',
      'СОРТ': 'Это был самый лучший _____ кофе.',
      'РОТ': 'Держи _____ на замке, если хочешь сохранить тайну.',
      'СТО': 'У него было _____ друзей, и каждый был готов помочь.',
      'ПОТ': 'Тяжелый труд и _____ — залог успеха.',
      'ТОП': 'Песня быстро возглавила _____ всех хит-парадов.'
    }
  },
  {
    lang: 'ru',
    letters: ['К', 'Р', 'А', 'Н'],
    validWords: ['КРАН', 'РАК', 'АРК'],
    hints: {
      'КРАН': 'Из-за поломки кухонный _____ начал капать.',
      'РАК': 'На безрыбье и _____ — рыба.',
      'АРК': 'Французская _____ — символ триумфа.'
    }
  },
  {
    lang: 'ru',
    letters: ['С', 'Л', 'О', 'В', 'О'],
    validWords: ['СЛОВО', 'ВОЛОС', 'СОЛО', 'ВОЛ', 'ЛОВ'],
    hints: {
      'СЛОВО': 'В начале было _____, и _____ было у Бога.',
      'ВОЛОС': 'Ни один _____ не упадет с его головы.',
      'СОЛО': 'Гитарист исполнил потрясающее _____ в середине песни.',
      'ВОЛ': 'Старый _____ медленно тянул повозку.',
      'ЛОВ': 'Удачный рыбный _____ порадовал всю деревню.'
    }
  }
];