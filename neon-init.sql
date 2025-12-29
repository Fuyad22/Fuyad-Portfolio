-- SQL to create the portfolio table for Neon
CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL
);

-- Insert initial data (replace {...} with your portfolio.json content)
INSERT INTO portfolio (data) VALUES ('{}');
