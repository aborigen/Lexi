import { WordLevel } from './types';

/**
 * @fileOverview English language levels for Lexi.AI.
 */

export const LEVELS_EN: WordLevel[] = [
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
    validWords: ['CLOUD', 'LOUD', 'COLD', 'DOC', 'OLD', 'DUO', 'COULD'],
    hints: {
      'CLOUD': 'Every _____ has a silver lining, as they say.',
      'LOUD': 'The music was so _____ the windows started to vibrate.',
      'COLD': 'Winter mornings are often very _____ and frosty.',
      'DOC': 'The _____ told him to take two pills and rest.',
      'OLD': 'They found an _____ map hidden in the attic.',
      'DUO': 'The famous musical _____ performed their latest hit.',
      'COULD': 'I wish I _____ fly like a bird in the sky.'
    }
  }
];
