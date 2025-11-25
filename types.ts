export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export enum Lane {
  LEFT = 0,
  CENTER = 1,
  RIGHT = 2,
}

export enum EntityType {
  PLAYER = 'PLAYER',
  OBSTACLE = 'OBSTACLE',
  RIVAL = 'RIVAL',
}

export interface GameObject {
  id: string;
  type: EntityType;
  lane: Lane;
  y: number; // Percentage from top (0-100)
  speed: number; // Speed relative to player
  // Specific props
  name?: string;
  description?: string;
  color?: string;
  era?: string; // For rivals
  icon?: string;
}

export interface RivalConfig {
  name: string;
  era: string;
  color: string;
  taunt: string;
}

export interface HighScore {
  score: number;
  date: string;
}
