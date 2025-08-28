CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread_id TEXT,
  role TEXT CHECK(role IN ('user','assistant')),
  text TEXT,
  tech_id TEXT,
  property_id TEXT,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id TEXT,
  unit TEXT,
  category TEXT,
  summary TEXT,
  embedding TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
