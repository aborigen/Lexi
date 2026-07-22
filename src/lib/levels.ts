
export interface WordLevel {
  letters: string[];
  validWords: string[];
  lang: 'en' | 'ru';
}

export const LEVELS: WordLevel[] = [
  {
    lang: 'ru',
    letters: ['П', 'И', 'Л', 'О', 'Т'],
    validWords: ['ПИЛОТ', 'ПОЛ', 'ЛОТ', 'ТИП', 'ПОТ', 'ТОП']
  },
  { 
    lang: 'en',
    letters: ['S', 'T', 'A', 'R', 'E'], 
    validWords: ['STAR', 'STARE', 'TEAR', 'RATE', 'ERA', 'ART', 'EAT', 'TEA', 'ARE', 'REST', 'EAST', 'SEAT'] 
  },
  { 
    lang: 'en',
    letters: ['P', 'L', 'A', 'T', 'E'], 
    validWords: ['PLATE', 'LEAP', 'PALE', 'PLEA', 'TALE', 'APE', 'TAP', 'TEA', 'EAT', 'PET', 'LET'] 
  },
  { 
    lang: 'en',
    letters: ['B', 'R', 'E', 'A', 'D'], 
    validWords: ['BREAD', 'BEAD', 'BARE', 'BEAR', 'READ', 'DEAR', 'RED', 'BED', 'BAD', 'ARE', 'ERA'] 
  },
  { 
    lang: 'en',
    letters: ['C', 'L', 'O', 'U', 'D'], 
    validWords: ['CLOUD', 'LOUD', 'COLD', 'DOC', 'OLD', 'Duo', 'COULD'] 
  },
  { 
    lang: 'en',
    letters: ['H', 'E', 'A', 'R', 'T'], 
    validWords: ['HEART', 'HATER', 'EARTH', 'HARE', 'HEAR', 'HEAT', 'RATE', 'TEAR', 'HAT', 'HER', 'EAR', 'ART', 'TEA', 'EAT'] 
  },
  {
    lang: 'ru',
    letters: ['К', 'О', 'М', 'А', 'Р'],
    validWords: ['КОМАР', 'КОРА', 'КОМА', 'МАК', 'РОК', 'РОМ']
  },
  {
    lang: 'ru',
    letters: ['К', 'Н', 'И', 'Г', 'А'],
    validWords: ['КНИГА', 'НИКА', 'КИНА', 'ГИКА']
  }
];
