-- Create the BlockLearn database if it doesn't exist,
-- using the utf8mb4 character set and utf8mb4_unicode_ci collation.
CREATE DATABASE IF NOT EXISTS `BlockLearn` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `BlockLearn`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `levels` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `level_number` INT UNSIGNED NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `requirements` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_level_progress` (
  `user_id` INT UNSIGNED NOT NULL,
  `level_id` INT UNSIGNED NOT NULL,
  `stars` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `level_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_level` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- Insert initial level data.
-- Each level may define unlock requirements as a JSON object,
-- where the key represents the level number and the value is the required star count.
-- ======================================================
INSERT INTO levels (level_number, name, description, requirements) VALUES
(1,  'Level 1',  'Beskrivelse', '{}'),
(2,  'Level 2',  'Beskrivelse', '{"1": 1}'),
(3,  'Level 3',  'Beskrivelse', '{"2": 1}'),
(4,  'Level 4',  'Beskrivelse', '{"3": 1}'),
(5,  'Level 5',  'Beskrivelse', '{"4": 1}'),
(6,  'Level 6',  'Beskrivelse', '{"5": 1}'),
(7,  'Level 7',  'Beskrivelse', '{"6": 1}'),
(8,  'Level 8',  'Beskrivelse', '{"7": 1}'),
(9,  'Level 9',  'Beskrivelse', '{"8": 1}'),
(10, 'Level 10', 'Beskrivelse', '{"9": 1, "8": 2}'),
(11, 'Level 11', 'Beskrivelse', '{"1": 3, "2": 3, "3": 3, "4": 3, "5": 3, "6": 3, "7": 3, "8": 3, "9": 3, "10": 3}'),
(12, 'Level 12', 'Beskrivelse', '{"1": 3, "2": 3, "3": 3, "4": 3, "5": 3, "6": 3, "7": 3, "8": 3, "9": 3, "10": 3, "11": 3}');
