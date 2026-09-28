export type TopicId = 'math' | 'korean' | 'physics';

export type DifficultyLevel = 'apprentice' | 'scholar' | 'academician';

export type QuestionType = 'multiple_choice' | 'input_deduction' | 'sequence_order';

export interface Option {
  id: string;
  label: string;
  explanationSnippet?: string;
}

export interface PuzzleQuestion {
  id: string;
  topic: TopicId;
  title: string;
  subTitle: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  storyContext: string; // Bối cảnh học thuật thế kỷ 17-19
  questionText: string;
  options?: Option[];
  correctAnswer: string; // Option id or exact string / normalized answer
  acceptableAnswers?: string[]; // For input deductions
  hint: string; // Gợi ý phong kín dưới dấu sáp
  detailedExplanation: string; // Lời bình giải kinh điển
  historicalFigure?: string; // e.g. Leonhard Euler, Vua Sejong, Isaac Newton
  diagramType?: 'euler_bridges' | 'golden_spiral' | 'hangul_vowels' | 'hangul_consonants' | 'prism_spectrum' | 'pendulum_clock' | 'archimedes_lever' | 'dice_fermat';
  points: number;
  zombieSpellName?: string; // Tên chiêu thức khắc chế thây ma
}

export interface UserAnswerRecord {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  usedHint: boolean;
  solvedAt: number;
}

export interface ZombieEnemy {
  id: string;
  name: string;
  type: 'crawler' | 'plague_doctor' | 'armored_knight' | 'mad_alchemist_boss';
  maxHp: number;
  hp: number;
  speed: number;
  distance: number; // 100 (far) to 0 (at barricade)
  damage: number;
  avatar: string;
  rewardPoints: number;
  weaknessTopic: TopicId;
}

export interface ArsenalWeapon {
  id: string;
  name: string;
  latinName: string;
  icon: string;
  damage: number;
  topicAffinity: TopicId;
  description: string;
  cost: number;
  unlocked: boolean;
  level: number;
}

export interface ScholarStats {
  score: number;
  solvedCount: number;
  totalAttempts: number;
  streak: number;
  bestStreak: number;
  zombiesKilled: number;
  nightsSurvived: number;
  silverCoins: number;
  barricadeLevel: number;
  unlockedMedals: string[];
  answeredRecords: Record<string, UserAnswerRecord>;
  bookmarkedIds: string[];
}

