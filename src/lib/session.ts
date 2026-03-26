const KEYS = {
  SESSION_TOKEN: 'fw_session_token',
  GAME_ID: 'fw_game_id',
  PLAYER_ID: 'fw_player_id',
} as const;

export interface SessionData {
  sessionToken: string | null;
  gameId: string | null;
  playerId: string | null;
}

export function getSession(): SessionData {
  if (typeof window === 'undefined') {
    return { sessionToken: null, gameId: null, playerId: null };
  }
  return {
    sessionToken: localStorage.getItem(KEYS.SESSION_TOKEN),
    gameId: localStorage.getItem(KEYS.GAME_ID),
    playerId: localStorage.getItem(KEYS.PLAYER_ID),
  };
}

export function setSession(sessionToken: string, gameId: string, playerId: string): void {
  localStorage.setItem(KEYS.SESSION_TOKEN, sessionToken);
  localStorage.setItem(KEYS.GAME_ID, gameId);
  localStorage.setItem(KEYS.PLAYER_ID, playerId);
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION_TOKEN);
  localStorage.removeItem(KEYS.GAME_ID);
  localStorage.removeItem(KEYS.PLAYER_ID);
}
