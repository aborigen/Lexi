
export interface WordLevel {
  letters: string[];
  validWords: string[];
}

export const LEVELS: WordLevel[] = [
  { 
    letters: ['S', 'T', 'A', 'R', 'E'], 
    validWords: ['STAR', 'STARE', 'TEAR', 'RATE', 'ERA', 'ART', 'EAT', 'TEA', 'ARE', 'REST', 'EAST', 'SEAT'] 
  },
  { 
    letters: ['P', 'L', 'A', 'T', 'E'], 
    validWords: ['PLATE', 'LEAP', 'PALE', 'PLEA', 'TALE', 'APE', 'TAP', 'TEA', 'EAT', 'PET', 'LET'] 
  },
  { 
    letters: ['B', 'R', 'E', 'A', 'D'], 
    validWords: ['BREAD', 'BEAD', 'BARE', 'BEAR', 'READ', 'DEAR', 'RED', 'BED', 'BAD', 'ARE', 'ERA'] 
  },
  { 
    letters: ['C', 'L', 'O', 'U', 'D'], 
    validWords: ['CLOUD', 'LOUD', 'COLD', 'DOC', 'OLD', 'Duo', 'COULD'] 
  },
  { 
    letters: ['H', 'E', 'A', 'R', 'T'], 
    validWords: ['HEART', 'HATER', 'EARTH', 'HARE', 'HEAR', 'HEAT', 'RATE', 'TEAR', 'HAT', 'HER', 'EAR', 'ART', 'TEA', 'EAT'] 
  },
];
