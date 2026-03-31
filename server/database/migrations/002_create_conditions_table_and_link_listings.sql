-- Normalize listing condition into a separate table and link listings via condition_id.
-- Run this after the initial schema and after migration 001 (if you already added listings.condition).

-- 1) Create conditions table
CREATE TABLE IF NOT EXISTS conditions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) Seed the allowed condition options
INSERT IGNORE INTO conditions (name) VALUES
('New'),
('Used'),
('Refurbished'),
('Certified Pre-Owned');

-- 3) Add condition_id to listings (nullable during backfill)
ALTER TABLE listings
  ADD COLUMN condition_id INT NULL AFTER model_id;

-- 4) Backfill condition_id from existing listings.condition (if present)
-- Map 'Certified PO' -> 'Certified Pre-Owned'
UPDATE listings l
JOIN conditions c ON c.name =
  CASE
    WHEN l.`condition` = 'Certified PO' THEN 'Certified Pre-Owned'
    ELSE l.`condition`
  END
SET l.condition_id = c.id
WHERE l.condition_id IS NULL;

-- 5) Default anything missing to Used
UPDATE listings l
JOIN conditions c ON c.name = 'Used'
SET l.condition_id = c.id
WHERE l.condition_id IS NULL;

-- 6) Make condition_id required and add FK
ALTER TABLE listings
  MODIFY condition_id INT NOT NULL,
  ADD CONSTRAINT fk_listings_condition
    FOREIGN KEY (condition_id) REFERENCES conditions(id);

-- 7) Optional: drop old ENUM column if it exists
-- If you haven't added listings.condition, skip this line safely by commenting it out.
ALTER TABLE listings
  DROP COLUMN `condition`;

