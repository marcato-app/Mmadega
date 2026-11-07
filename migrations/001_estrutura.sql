-- Estrutura do banco da Adega MM (Cloudflare D1).
-- Rodar uma vez, antes das outras migrações.

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sections (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS groups (
  id         TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES sections(id),
  title      TEXT NOT NULL,
  note       TEXT NOT NULL DEFAULT '',
  keywords   TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS groups_by_section ON groups (section_id, sort_order);

CREATE TABLE IF NOT EXISTS items (
  id          TEXT PRIMARY KEY,
  group_id    TEXT NOT NULL REFERENCES groups(id),
  name        TEXT NOT NULL,
  unit        TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL,
  note        TEXT NOT NULL DEFAULT '',
  sold_out    INTEGER NOT NULL DEFAULT 0,
  hidden      INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS items_by_group ON items (group_id, sort_order);

CREATE TABLE IF NOT EXISTS admin_users (
  id            TEXT PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token      TEXT PRIMARY KEY,
  admin_id   TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
  username     TEXT PRIMARY KEY,
  fail_count   INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT
);
