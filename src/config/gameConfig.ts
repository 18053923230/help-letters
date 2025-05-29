export interface DifficultyLevel {
  level: number;
  initialHealth: number;
  healthDecay: number;  // 每秒下降值
  correctBonus: number; // 正确答案加分
  optionsCount: number; // 显示选项数量
  timeLimit: number;    // 作答时间限制(秒)
}

export const difficultyLevels: DifficultyLevel[] = [
  { level: 1, initialHealth: 60, healthDecay: 1, correctBonus: 10, optionsCount: 4, timeLimit: 100 },
  { level: 2, initialHealth: 55, healthDecay: 1.2, correctBonus: 8, optionsCount: 5, timeLimit: 90 },
  { level: 3, initialHealth: 50, healthDecay: 1.4, correctBonus: 8, optionsCount: 5, timeLimit: 80 },
  { level: 4, initialHealth: 45, healthDecay: 1.6, correctBonus: 7, optionsCount: 6, timeLimit: 80 },
  { level: 5, initialHealth: 40, healthDecay: 1.8, correctBonus: 7, optionsCount: 6, timeLimit: 70 },
  { level: 6, initialHealth: 35, healthDecay: 2.0, correctBonus: 6, optionsCount: 7, timeLimit: 70 },
  { level: 7, initialHealth: 30, healthDecay: 2.2, correctBonus: 6, optionsCount: 7, timeLimit: 60 },
  { level: 8, initialHealth: 25, healthDecay: 2.4, correctBonus: 5, optionsCount: 8, timeLimit: 60 },
  { level: 9, initialHealth: 20, healthDecay: 2.6, correctBonus: 5, optionsCount: 8, timeLimit: 50 },
  { level: 10, initialHealth: 15, healthDecay: 3.0, correctBonus: 4, optionsCount: 9, timeLimit: 50 }
]