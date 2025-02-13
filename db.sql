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
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `level_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_level` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO levels (level_number, name, description, requirements) VALUES
(1, 'Level 1', 'Introduktion til spillet', '{}'),
(2, 'Level 2', 'Afslut Level 1 med mindst 1 stjerne', '{"1": 1}'),
(3, 'Level 3', 'Afslut Level 2 med mindst 1 stjerne', '{"2": 1}'),
(4, 'Level 4', 'Afslut Level 3 med mindst 1 stjerne', '{"3": 1}'),
(5, 'Level 5', 'Afslut Level 3 med 2 stjerner og Level 4 med 2 stjerner', '{"3": 2, "4": 2}'),
(6, 'Level 6', 'Afslut Level 4 med mindst 1 stjerne', '{"4": 1}'),
(7, 'Level 7', 'Afslut Level 6 med mindst 1 stjerne', '{"6": 1}'),
(8, 'Level 8', 'Afslut Level 7 med mindst 1 stjerne', '{"7": 1}'),
(9, 'Level 9', 'Afslut Level 8 med mindst 1 stjerne', '{"8": 1}'),
(10, 'Level 10', 'Afslut Level 8 med 2 stjerner og Level 9 med 2 stjerner', '{"8": 2, "9": 2}'),
(11, 'Level 11', 'Afslut Level 10 med mindst 1 stjerne', '{"10": 1}'),
(12, 'Level 12', 'Afslut Level 11 med mindst 1 stjerne', '{"11": 1}'),
(13, 'Level 13', 'Afslut Level 12 med mindst 1 stjerne', '{"12": 1}'),
(14, 'Level 14', 'Afslut Level 13 med mindst 1 stjerne', '{"13": 1}'),
(15, 'Level 15', 'Afslut Level 13 med 2 stjerner og Level 14 med 2 stjerner', '{"13": 2, "14": 2}'),
(16, 'Level 16', 'Afslut Level 15 med mindst 1 stjerne', '{"15": 1}'),
(17, 'Level 17', 'Afslut Level 16 med mindst 1 stjerne', '{"16": 1}'),
(18, 'Level 18', 'Afslut Level 17 med mindst 1 stjerne', '{"17": 1}'),
(19, 'Level 19', 'Afslut Level 18 med mindst 1 stjerne', '{"18": 1}'),
(20, 'Level 20', 'Afslut Level 18 med 2 stjerner og Level 19 med 2 stjerner', '{"18": 2, "19": 2}'),
(21, 'Level 21', 'Afslut Level 20 med mindst 1 stjerne', '{"20": 1}'),
(22, 'Level 22', 'Afslut Level 21 med mindst 1 stjerne', '{"21": 1}'),
(23, 'Level 23', 'Afslut Level 22 med mindst 1 stjerne', '{"22": 1}'),
(24, 'Level 24', 'Afslut Level 23 med mindst 1 stjerne', '{"23": 1}'),
(25, 'Level 25', 'Afslut Level 23 med 2 stjerner og Level 24 med 2 stjerner', '{"23": 2, "24": 2}'),
(26, 'Level 26', 'Afslut Level 25 med mindst 1 stjerne', '{"25": 1}'),
(27, 'Level 27', 'Afslut Level 26 med mindst 1 stjerne', '{"26": 1}'),
(28, 'Level 28', 'Afslut Level 27 med mindst 1 stjerne', '{"27": 1}'),
(29, 'Level 29', 'Afslut Level 28 med mindst 1 stjerne', '{"28": 1}'),
(30, 'Level 30', 'Afslut Level 28 med 2 stjerner og Level 29 med 2 stjerner', '{"28": 2, "29": 2}');
