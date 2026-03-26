CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  join_code TEXT UNIQUE NOT NULL,
  ship_name TEXT NOT NULL DEFAULT '',
  host_player_id UUID,
  status TEXT DEFAULT 'lobby' CHECK (status IN ('lobby', 'setup', 'active', 'paused', 'finished')),
  character_mode TEXT DEFAULT 'choice' CHECK (character_mode IN ('choice', 'random')),
  role_mode TEXT DEFAULT 'choice' CHECK (role_mode IN ('choice', 'random')),
  scenario_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  pirate_name TEXT,
  character_type TEXT,
  ship_roles TEXT[] DEFAULT '{}',
  is_host BOOLEAN DEFAULT FALSE,
  session_token TEXT UNIQUE NOT NULL,
  connected BOOLEAN DEFAULT TRUE,
  player_order INTEGER,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE character_sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  exploration INTEGER DEFAULT 0 CHECK (exploration >= 0 AND exploration <= 7),
  brawn INTEGER DEFAULT 0 CHECK (brawn >= 0 AND brawn <= 7),
  hunting INTEGER DEFAULT 0 CHECK (hunting >= 0 AND hunting <= 7),
  aim INTEGER DEFAULT 0 CHECK (aim >= 0 AND aim <= 7),
  swagger INTEGER DEFAULT 0 CHECK (swagger >= 0 AND swagger <= 7),
  navigation INTEGER DEFAULT 0 CHECK (navigation >= 0 AND navigation <= 7),
  constellation_filled INTEGER[] DEFAULT '{}',
  constellation_events_completed INTEGER DEFAULT 0,
  story_blanks JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ship_log_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  author_player_id UUID REFERENCES players(id),
  content TEXT NOT NULL,
  entry_type TEXT DEFAULT 'log' CHECK (entry_type IN ('log', 'threat_event', 'captains_quarters', 'captains_mission')),
  entry_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_games_join_code ON games(join_code) WHERE status != 'finished';
CREATE INDEX idx_players_session_token ON players(session_token);
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_log_entries_game_id ON ship_log_entries(game_id);
CREATE UNIQUE INDEX idx_unique_character_per_game ON players(game_id, character_type) WHERE character_type IS NOT NULL;

-- Activity tracking trigger
CREATE OR REPLACE FUNCTION update_game_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE games SET last_activity_at = NOW() WHERE id = NEW.game_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER character_sheet_activity
  AFTER UPDATE ON character_sheets
  FOR EACH ROW EXECUTE FUNCTION update_game_activity();

-- Enable Realtime on games and players only
ALTER PUBLICATION supabase_realtime ADD TABLE games, players;

-- RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ship_log_entries ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "games_select" ON games FOR SELECT USING (true);
CREATE POLICY "games_insert" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "games_update" ON games FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "games_no_delete" ON games FOR DELETE USING (false);

-- Players policies
CREATE POLICY "players_select" ON players FOR SELECT USING (true);
CREATE POLICY "players_insert" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "players_update_own" ON players FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "players_no_delete" ON players FOR DELETE USING (false);

-- Character sheets policies
CREATE POLICY "sheets_select" ON character_sheets FOR SELECT USING (true);
CREATE POLICY "sheets_insert" ON character_sheets FOR INSERT WITH CHECK (true);
CREATE POLICY "sheets_update" ON character_sheets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sheets_no_delete" ON character_sheets FOR DELETE USING (false);

-- Ship log policies
CREATE POLICY "log_select" ON ship_log_entries FOR SELECT USING (true);
CREATE POLICY "log_insert" ON ship_log_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "log_update" ON ship_log_entries FOR UPDATE USING (true);
CREATE POLICY "log_no_delete" ON ship_log_entries FOR DELETE USING (false);
