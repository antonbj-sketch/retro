import { RivalConfig } from './types';

export const LANE_COUNT = 3;
export const PLAYER_Y_POS = 80; // Player fixed at 80% down the screen
export const GAME_SPEED_START = 0.8; // Base speed
export const GAME_SPEED_MAX = 2.5;
export const SPAWN_RATE_MS = 1200;

export const RIVALS: RivalConfig[] = [
  { name: "Al 'The Tommy' Capwn", era: "1920s", color: "bg-amber-800", taunt: "See ya, wise guy!" },
  { name: "Sir Lags-A-Lot", era: "1300s", color: "bg-slate-500", taunt: "Thou art too slow, knave!" },
  { name: "Crypto Chad", era: "2024", color: "bg-blue-400", taunt: "Have fun staying poor (and slow)!" },
  { name: "Grok the Caveman", era: "10000 BC", color: "bg-stone-600", taunt: "Me fast. You food." },
  { name: "Steam Baroness", era: "1890s", color: "bg-yellow-700", taunt: "My gears turn faster than your wit!" },
];

export const OBSTACLES = [
  { name: "Dial-up Modem", icon: "📠" },
  { name: "Rubik's Cube", icon: "🧊" },
  { name: "Laser Grid", icon: "⚡" },
  { name: "VHS Tape", icon: "📼" },
  { name: "Banana Peel", icon: "🍌" }, 
  { name: "Time Vortex", icon: "🌀" },
  { name: "Giant 8-Ball", icon: "🎱" },
  { name: "Pizza Rat", icon: "🐀" },
  { name: "Wet Floor Sign", icon: "⚠️" },
  { name: "Keytar", icon: "🎹" },
  { name: "Floppy Disk", icon: "💾" },
  { name: "Arcade Cabinet", icon: "🕹️" },
  { name: "Neon Palm", icon: "🌴" },
  { name: "Boombox", icon: "📻" },
  { name: "Roller Skate", icon: "🛼" },
];