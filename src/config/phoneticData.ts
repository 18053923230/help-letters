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
      { key: 'b', audio: 'b.mp3', isLocked: false, hasHardMode: true, isHardModeLocked: true, order: 1 },
      { key: 'p', audio: 'p.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 2 },
      { key: 'm', audio: 'm.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 3 },
      { key: 'f', audio: 'f.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 4 },
      { key: 'd', audio: 'd.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 5 },
      { key: 't', audio: 't.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 6 },
      { key: 'n', audio: 'n.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 7 },
      { key: 'l', audio: 'l.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 8 },
      { key: 'g', audio: 'g.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 9 },
      { key: 'k', audio: 'k.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 10 },
      { key: 'h', audio: 'h.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 11 },
      { key: 'j', audio: 'j.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 12 },
      { key: 'q', audio: 'q.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 13 },
      { key: 'x', audio: 'x.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 14 },
      { key: 'zh', audio: 'zh.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 15 },
      { key: 'ch', audio: 'ch.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 16 },
      { key: 'sh', audio: 'sh.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 17 },
      { key: 'r', audio: 'r.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 18 },
      { key: 'z', audio: 'z.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 19 },
      { key: 'c', audio: 'c.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 20 },
      { key: 's', audio: 's.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 21 },
      { key: 'y', audio: 'y.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 22 },
      { key: 'w', audio: 'w.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 23 }
    ]
  },
  {
    id: 'finals',
    name: '韵母',
    isLocked: true,
    items: [
      { key: 'a', audio: 'a.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 1 },
      { key: 'o', audio: 'o.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 2 },
      { key: 'e', audio: 'e.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 3 },
      { key: 'i', audio: 'i.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 4 },
      { key: 'u', audio: 'u.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 5 },
      { key: 'ü', audio: 'v.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 6 },
      { key: 'ai', audio: 'ai.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 7 },
      { key: 'ei', audio: 'ei.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 8 },
      { key: 'ui', audio: 'ui.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 9 },
      { key: 'ao', audio: 'ao.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 10 },
      { key: 'ou', audio: 'ou.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 11 },
      { key: 'iu', audio: 'iu.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 12 },
      { key: 'ie', audio: 'ie.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 13 },
      { key: 'üe', audio: 've.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 14 },
      { key: 'er', audio: 'er.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 15 },
      { key: 'an', audio: 'an.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 16 },
      { key: 'en', audio: 'en.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 17 },
      { key: 'in', audio: 'in.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 18 },
      { key: 'un', audio: 'un.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 19 },
      { key: 'ün', audio: 'vn.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 20 },
      { key: 'ang', audio: 'ang.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 21 },
      { key: 'eng', audio: 'eng.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 22 },
      { key: 'ing', audio: 'ing.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 23 },
      { key: 'ong', audio: 'ong.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 24 }
    ]
  },
  {
    id: 'syllables',
    name: '整体认读',
    isLocked: true,
    items: [
      { key: 'zhi', audio: 'zhi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 1 },
      { key: 'chi', audio: 'chi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 2 },
      { key: 'shi', audio: 'shi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 3 },
      { key: 'ri', audio: 'ri.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 4 },
      { key: 'zi', audio: 'zi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 5 },
      { key: 'ci', audio: 'ci.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 6 },
      { key: 'si', audio: 'si.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 7 },
      { key: 'yi', audio: 'yi.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 8 },
      { key: 'wu', audio: 'wu.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 9 },
      { key: 'yu', audio: 'yu.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 10 },
      { key: 'ye', audio: 'ye.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 11 },
      { key: 'yue', audio: 'yue.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 12 },
      { key: 'yuan', audio: 'yuan.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 13 },
      { key: 'yin', audio: 'yin.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 14 },
      { key: 'yun', audio: 'yun.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 15 },
      { key: 'ying', audio: 'ying.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 16 },
      // { key: 'iong', audio: 'iong.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 17 }

    ]
  }
]