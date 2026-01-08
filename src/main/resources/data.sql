-- Users (Password is 'password')
INSERT INTO users (user_id, username, email, password, full_name, role, created_at, updated_at) VALUES
(1, 'admin', 'admin@library.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Admin User', 'ADMIN', NOW(), NOW()),
(2, 'librarian', 'lib@library.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Librarian User', 'LIBRARIAN', NOW(), NOW()),
(3, 'basiru_jallow', 'basiru@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Basiru Jallow', 'MEMBER', NOW(), NOW()),
(4, 'ebrima_njie', 'ebrima@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Ebrima Njie', 'MEMBER', NOW(), NOW()),
(5, 'abdoulie_jallow', 'abdoulie@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Abdoulie Jallow', 'MEMBER', NOW(), NOW()),
(6, 'fatou_bojang', 'fatou@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Fatou Bojang', 'MEMBER', NOW(), NOW()),
(7, 'mariama_camara', 'mariama@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Mariama Camara', 'MEMBER', NOW(), NOW()),
(8, 'kemo_sonko', 'kemo@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Kemo Sonko', 'MEMBER', NOW(), NOW()),
(9, 'ainetou_sowe', 'ainetou@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Ainetou Sowe', 'MEMBER', NOW(), NOW()),
(10, 'lamin_darboe', 'lamin@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Lamin Darboe', 'MEMBER', NOW(), NOW()),
(11, 'isatou_njie', 'isatou@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Isatou Njie', 'MEMBER', NOW(), NOW()),
(12, 'musa_touray', 'musa@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Musa Touray', 'MEMBER', NOW(), NOW());

-- Members
INSERT INTO members (user_id, membership_number, phone_number, address, membership_type, membership_start_date, membership_end_date, is_active, created_at, updated_at) VALUES
(3, 'MEM001', '555-0101', '22 Kairaba Avenue, Serrekunda', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW()),
(4, 'MEM002', '555-0102', '15 Marina Parade, Banjul', 'FACULTY', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW()),
(5, 'MEM003', '555-0103', '10 Kombo Sillah Drive, Bakoteh', 'PUBLIC', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW()),
(6, 'MEM004', '555-0104', '5 Senegambia Highway, Kololi', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW()),
(7, 'MEM005', '555-0105', '8 Bertil Harding Highway, Brusubi', 'PUBLIC', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW()),
(8, 'MEM006', '555-0106', '12 Atlantic Boulevard, Bakau', 'FACULTY', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW()),
(9, 'MEM007', '555-0107', '34 Sayerr Jobe Avenue, Serekunda', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW()),
(10, 'MEM008', '555-0108', '18 Mosque Road, Latrikunda', 'PUBLIC', DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), DATE_ADD(CURRENT_DATE, INTERVAL 11 MONTH), true, NOW(), NOW()),
(11, 'MEM009', '555-0109', '7 Mamadi Manjang Highway, Kanifing', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), false, NOW(), NOW()),
(12, 'MEM010', '555-0110', '25 Brikama Highway, Brikama', 'PUBLIC', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true, NOW(), NOW());

-- Books
INSERT INTO books (book_id, isbn, title, author, publication_year, total_copies, available_copies, created_at, updated_at) VALUES
(1, '978-0134685991', 'Effective Java', 'Joshua Bloch', 2018, 5, 5, NOW(), NOW()),
(2, '978-0321356680', 'Clean Code', 'Robert C. Martin', 2008, 3, 3, NOW(), NOW()),
(3, '978-0131103627', 'The C Programming Language', 'Brian W. Kernighan', 1988, 2, 2, NOW(), NOW()),
(4, '978-0201633610', 'Design Patterns', 'Erich Gamma', 1994, 4, 4, NOW(), NOW()),
(5, '978-0321125217', 'Domain-Driven Design', 'Eric Evans', 2003, 2, 2, NOW(), NOW()),
(6, '978-1617290459', 'Spring in Action', 'Craig Walls', 2018, 3, 3, NOW(), NOW()),
(7, '978-0451524935', '1984', 'George Orwell', 1949, 10, 10, NOW(), NOW()),
(8, '978-0743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 8, 8, NOW(), NOW()),
(9, '978-0061120084', 'To Kill a Mockingbird', 'Harper Lee', 1960, 6, 6, NOW(), NOW()),
(10, '978-0452284234', '1984 (Classic)', 'George Orwell', 1949, 5, 5, NOW(), NOW()),
(11, '978-0345391803', 'The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 1979, 4, 4, NOW(), NOW()),
(12, '978-0307474278', 'The Da Vinci Code', 'Dan Brown', 2003, 7, 7, NOW(), NOW());

-- Borrowing Records
-- Active Borrowings
INSERT INTO borrowing_records (member_id, book_id, borrow_date, due_date, status, late_fee, created_at, updated_at) VALUES
(1, 1, DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY), 'BORROWED', 0, NOW(), NOW()),
(1, 2, DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 12 DAY), 'BORROWED', 0, NOW(), NOW()),

-- Returned Borrowings
(2, 3, DATE_SUB(CURRENT_DATE, INTERVAL 20 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), 'RETURNED', 0, NOW(), NOW()), 
(2, 4, DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 16 DAY), 'RETURNED', 2.00, NOW(), NOW()), -- Returned 1 day late

-- Overdue Borrowings (Active but late)
(3, 5, DATE_SUB(CURRENT_DATE, INTERVAL 20 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), 'BORROWED', 0, NOW(), NOW()), -- Due 6 days ago
(4, 6, DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'BORROWED', 0, NOW(), NOW()); -- Due yesterday

-- Update available copies to reflect borrowings
UPDATE books SET available_copies = available_copies - 1 WHERE book_id IN (1, 2, 5, 6);
