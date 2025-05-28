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
      // ... 其他声母
    ]
  },
  {
    id: 'finals',
    name: '韵母',
    isLocked: true,
    items: [
      { key: 'a', audio: 'a.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 1 },
      { key: 'o', audio: 'o.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 2 },
      // ... 其他韵母
    ]
  },
  {
    id: 'syllables',
    name: '整体认读',
    isLocked: true,
    items: [
      { key: 'ba', audio: 'ba.mp3', isLocked: true, hasHardMode: true, isHardModeLocked: true, order: 1 },
      // ... 其他音节
    ]
  }
]