-- ============================================================
-- Lost & Found — MySQL schema
-- Import bằng một trong 2 cách:
--   Cách 1 (command line):  mysql -u root -p < database/schema.sql
--   Cách 2 (phpMyAdmin):    tạo DB > tab Import > chọn file này
-- ============================================================

CREATE DATABASE IF NOT EXISTS lostitems
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lostitems;

CREATE TABLE IF NOT EXISTS items (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phoneno     VARCHAR(50)  NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT         NOT NULL,
  image       VARCHAR(255) DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Dữ liệu mẫu để Test nhanh (tùy chọn, có thể xóa)
INSERT INTO items (name, email, phoneno, title, description, image) VALUES
  ('John Doe',   'john@example.com', '0901234567', 'Lost black wallet',  'Lost a black leather wallet near the library on Monday.', NULL),
  ('Jane Smith', 'jane@example.com', '0912345678', 'Found car keys',     'Found a set of car keys in the cafeteria.',               NULL);
