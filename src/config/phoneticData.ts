export interface PhoneticItem {
  key: string;
  audio: string;
  isLocked: boolean;
  hasHardMode: boolean;
  isHardModeLocked: boolean;
  order: number;
}

export interface PhoneticCategory {
  id: string;
  name: string;
  isLocked: boolean;
  items: PhoneticItem[];
}

// 标准普通话声母、韵母数据配置
export const phoneticData: PhoneticCategory[] = [
  {
    id: 'initials',
    name: '声母',
    isLocked: false,
    items: [
      { key: 'b', audio: 'initials/b.mp3', isLocked: false, hasHardMode: true, isHardModeLocked: true, order: 1 },
      { key: 'p', audio: 'initials/p.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 2 },
      { key: 'm', audio: 'initials/m.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 3 },
      { key: 'f', audio: 'initials/f.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 4 },
      { key: 'd', audio: 'initials/d.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 5 },
      { key: 't', audio: 'initials/t.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 6 },
      { key: 'n', audio: 'initials/n.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 7 },
      { key: 'l', audio: 'initials/l.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 8 },
      { key: 'g', audio: 'initials/g.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 9 },
      { key: 'k', audio: 'initials/k.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 10 },
      { key: 'h', audio: 'initials/h.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 11 },
      { key: 'j', audio: 'initials/j.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 12 },
      { key: 'q', audio: 'initials/q.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 13 },
      { key: 'x', audio: 'initials/x.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 14 },
      { key: 'zh', audio: 'initials/zh.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 15 },
      { key: 'ch', audio: 'initials/ch.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 16 },
      { key: 'sh', audio: 'initials/sh.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 17 },
      { key: 'r', audio: 'initials/r.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 18 },
      { key: 'z', audio: 'initials/z.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 19 },
      { key: 'c', audio: 'initials/c.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 20 },
      { key: 's', audio: 'initials/s.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 21 },
      { key: 'y', audio: 'initials/y.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 22 },
      { key: 'w', audio: 'initials/w.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 23 }
    ]
  },
  {
    id: 'finals',
    name: '韵母',
    isLocked: true,
    items: [
      { key: 'a', audio: 'finals/a.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 1 },
      { key: 'o', audio: 'finals/o.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 2 },
      { key: 'e', audio: 'finals/e.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 3 },
      { key: 'i', audio: 'finals/i.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 4 },
      { key: 'u', audio: 'finals/u.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 5 },
      { key: 'ü', audio: 'finals/ü.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 6 },
      { key: 'ai', audio: 'finals/ai.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 7 },
      { key: 'ei', audio: 'finals/ei.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 8 },
      { key: 'ui', audio: 'finals/ui.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 9 },
      { key: 'ao', audio: 'finals/ao.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 10 },
      { key: 'ou', audio: 'finals/ou.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 11 },
      { key: 'iu', audio: 'finals/iu.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 12 },
      { key: 'ie', audio: 'finals/ie.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 13 },
      { key: 'üe', audio: 'finals/üe.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 14 },
      { key: 'er', audio: 'finals/er.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 15 },
      { key: 'an', audio: 'finals/an.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 16 },
      { key: 'en', audio: 'finals/en.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 17 },
      { key: 'in', audio: 'finals/in.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 18 },
      { key: 'un', audio: 'finals/un.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 19 },
      { key: 'ün', audio: 'finals/ün.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 20 },
      { key: 'ang', audio: 'finals/ang.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 21 },
      { key: 'eng', audio: 'finals/eng.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 22 },
      { key: 'ing', audio: 'finals/ing.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 23 },
      { key: 'ong', audio: 'finals/ong.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 24 }
    ]
  },
  {
    id: 'syllables',
    name: '整体认读',
    isLocked: true,
    items: [
      { key: 'zhi', audio: 'syllables/zhi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 1 },
      { key: 'chi', audio: 'syllables/chi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 2 },
      { key: 'shi', audio: 'syllables/shi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 3 },
      { key: 'ri', audio: 'syllables/ri.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 4 },
      { key: 'zi', audio: 'syllables/zi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 5 },
      { key: 'ci', audio: 'syllables/ci.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 6 },
      { key: 'si', audio: 'syllables/si.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 7 },
      { key: 'yi', audio: 'syllables/yi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 8 },
      { key: 'wu', audio: 'syllables/wu.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 9 },
      { key: 'yu', audio: 'syllables/yu.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 10 },
      { key: 'ye', audio: 'syllables/ye.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 11 },
      { key: 'yue', audio: 'syllables/yue.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 12 },
      { key: 'yuan', audio: 'syllables/yuan.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 13 },
      { key: 'yin', audio: 'syllables/yin.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 14 },
      { key: 'yun', audio: 'syllables/yun.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 15 },
      { key: 'ying', audio: 'syllables/ying.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 16 },
      // { key: 'iong', audio: 'iong.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 17 }

    ]
  }
]