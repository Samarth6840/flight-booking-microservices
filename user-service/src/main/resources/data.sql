-- Admin user (password is BCrypt encoded 'admin123')
INSERT INTO `user` (name, email, password, role) VALUES 
('Admin', 'admin@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.kXiGJxNbkKqKBPkCdy', 'ADMIN')
ON DUPLICATE KEY UPDATE email = email;