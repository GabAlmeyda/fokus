import type { JSX } from 'react';
import * as LuIcons from 'react-icons/lu';

const HABIT_ICONS = {
  gym: LuIcons.LuDumbbell,
  water: LuIcons.LuDroplets,
  diet: LuIcons.LuApple,
  run: LuIcons.LuZap,
  sleep: LuIcons.LuMoon,
  book: LuIcons.LuBookOpen,
  code: LuIcons.LuCode,
  work: LuIcons.LuBriefcase,
  language: LuIcons.LuLanguages,
  study: LuIcons.LuGraduationCap,
  meditation: LuIcons.LuBrain,
  music: LuIcons.LuMusic,
  art: LuIcons.LuPalette,
  heart: LuIcons.LuHeart,
  social: LuIcons.LuUsers,
  home: LuIcons.LuHouse,
  finance: LuIcons.LuCoins,
  plants: LuIcons.LuSprout,
  cleanup: LuIcons.LuBrush,
  target: LuIcons.LuTarget,
  unmarked: LuIcons.LuBadge,
  marked: LuIcons.LuBadgeCheck,
  bell: LuIcons.LuBell,
  left: LuIcons.LuChevronLeft,
  'big-left': LuIcons.LuArrowBigLeftDash,
  right: LuIcons.LuChevronRight,
  'big-right': LuIcons.LuArrowBigRightDash,
  user: LuIcons.LuCircleUserRound,
  menu: LuIcons.LuMenu,
  moon: LuIcons.LuMoon,
  sun: LuIcons.LuSunMedium,
} as const;

export type FokusIconKey = keyof typeof HABIT_ICONS;

interface FokusIconProps {
  iconKey: FokusIconKey;
  className?: string;
}

export default function FokusIcon({
  iconKey,
  className = '',
}: FokusIconProps): JSX.Element {
  const Icon = HABIT_ICONS[iconKey] || LuIcons.LuCircleAlert;

  return <Icon className={className} />;
}
