-- ChryslerStellantisCar Selling Platform - MySQL Schema
-- Run this in cPanel phpMyAdmin or MySQL

CREATE DATABASE IF NOT EXISTS chrysler_stellantis;
USE chrysler_stellantis;

-- Users (buyers, sellers, admin)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Car makes (e.g. Toyota, BMW)
CREATE TABLE makes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Car models (e.g. Corolla, M2)
CREATE TABLE models (
  id INT AUTO_INCREMENT PRIMARY KEY,
  make_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  FOREIGN KEY (make_id) REFERENCES makes(id) ON DELETE CASCADE,
  UNIQUE KEY (make_id, slug),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conditions (e.g. New, Used)
CREATE TABLE conditions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO conditions (name) VALUES
('New'),
('Used'),
('Refurbished'),
('Certified Pre-Owned');

-- Countries (for "Cars In Any Country")
CREATE TABLE countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL,
  flag_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings (cars for sale)
CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  make_id INT NOT NULL,
  model_id INT NOT NULL,
  condition_id INT NOT NULL,
  year INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  mileage_km INT,
  transmission ENUM('Automatic', 'Manual') NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  location_city VARCHAR(100),
  location_country VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  images_json JSON,
  status ENUM('active', 'sold', 'pending', 'featured') DEFAULT 'active',
  is_featured TINYINT(1) DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sold_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (make_id) REFERENCES makes(id),
  FOREIGN KEY (model_id) REFERENCES models(id),
  FOREIGN KEY (condition_id) REFERENCES conditions(id),
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_price (price),
  INDEX idx_make_model (make_id, model_id)
);

-- Blog posts (Latest News)
CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image_url VARCHAR(500),
  author_id INT,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  INDEX idx_published (published_at)
);

-- Testimonials (Our Happy Clients)
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  avatar_url VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers
CREATE TABLE newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed admin user (password: admin123) - change after first login
-- Run: node server/scripts/seed.js to create admin (admin@chrysler-stellantis.org / admin123) and sample data
