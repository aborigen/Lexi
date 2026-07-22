'use client';

type TranslationKeys = 
  | 'high_score'
  | 'score'
  | 'reset'
  | 'tactical_guide'
  | 'guide_draw'
  | 'guide_find'
  | 'guide_clear'
  | 'found_words'
  | 'ai_advisor'
  | 'get_hint'
  | 'analyzing'
  | 'strategy_identified'
  | 'wait_ai'
  | 'game_over_title'
  | 'game_over_desc'
  | 'ai_failed_title'
  | 'ai_failed_desc'
  | 'next_level'
  | 'hint_all_found'
  | 'hint_template';

const translations: Record<string, Record<TranslationKeys, string>> = {
  en: {
    high_score: 'High',
    score: 'Score',
    reset: 'Reset',
    tactical_guide: 'WORD GUIDE',
    guide_draw: 'Drag through letters to form a word.',
    guide_find: 'Find all valid words to advance.',
    guide_clear: 'Incorrect words will reset the selection.',
    found_words: 'Found Words',
    ai_advisor: 'LEXICAL AI',
    get_hint: 'GET CITATION',
    analyzing: 'THINKING',
    strategy_identified: 'CITATION HINT',
    wait_ai: 'Need a clue? The AI can find a famous quote with a missing word.',
    game_over_title: 'Level Complete!',
    game_over_desc: 'You found all words!',
    ai_failed_title: 'Lexical Link Failed',
    ai_failed_desc: 'The AI is currently speechless. Try again in a moment.',
    next_level: 'Next Level',
    hint_all_found: 'You found them all!',
    hint_template: 'Hmm... Try a {n}-letter word starting with "{c}"'
  },
  ru: {
    high_score: 'Рекорд',
    score: 'Счет',
    reset: 'Сброс',
    tactical_guide: 'ПРАВИЛА',
    guide_draw: 'Проведите линию через буквы, чтобы составить слово.',
    guide_find: 'Найдите все слова для перехода на след. уровень.',
    guide_clear: 'Неверные слова сбросят текущее выделение.',
    found_words: 'Найденные слова',
    ai_advisor: 'ЛИНГВО-ИИ',
    get_hint: 'ЦИТАТА',
    analyzing: 'ДУМАЕТ...',
    strategy_identified: 'ЦИТАТА-ПОДСКАЗКА',
    wait_ai: 'Нужна зацепка? ИИ подберет цитату с пропущенным словом.',
    game_over_title: 'Уровень пройден!',
    game_over_desc: 'Вы нашли все слова!',
    ai_failed_title: 'Сбой лингво-связи',
    ai_failed_desc: 'ИИ временно потерял дар речи. Попробуйте еще раз.',
    next_level: 'След. уровень',
    hint_all_found: 'Вы нашли все слова!',
    hint_template: 'Хм... Попробуйте слово из {n} букв на "{c}"'
  }
};

export function t(key: TranslationKeys, lang: string = 'en'): string {
  const language = translations[lang] ? lang : 'en';
  return translations[language][key] || translations['en'][key];
}
