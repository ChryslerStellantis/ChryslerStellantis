-- Add condition field to listings (run once)
ALTER TABLE listings
  ADD COLUMN `condition` ENUM('New','Used','Refurbished','Certified PO') NOT NULL DEFAULT 'Used'
  AFTER model_id;

