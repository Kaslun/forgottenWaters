export type GameStatus = 'lobby' | 'setup' | 'active' | 'paused' | 'finished';
export type SelectionMode = 'choice' | 'random';

export interface Game {
  id: string;
  join_code: string;
  ship_name: string;
  host_player_id: string | null;
  status: GameStatus;
  character_mode: SelectionMode;
  role_mode: SelectionMode;
  scenario_name: string | null;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface Player {
  id: string;
  game_id: string;
  display_name: string;
  pirate_name: string | null;
  character_type: string | null;
  ship_roles: string[];
  is_host: boolean;
  session_token: string;
  connected: boolean;
  player_order: number;
  joined_at: string;
}

export interface CharacterSheet {
  id: string;
  player_id: string;
  game_id: string;
  exploration: number;
  brawn: number;
  hunting: number;
  aim: number;
  swagger: number;
  navigation: number;
  constellation_filled: number[];
  constellation_events_completed: number;
  story_blanks: Record<string, string>;
  updated_at: string;
}

export interface ShipLogEntry {
  id: string;
  game_id: string;
  author_player_id: string;
  content: string;
  entry_type: 'log' | 'threat_event' | 'captains_quarters' | 'captains_mission';
  entry_order: number;
  created_at: string;
}
