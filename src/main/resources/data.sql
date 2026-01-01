-- Users (Password is 'password')
INSERT INTO users (user_id, username, email, password, full_name, role) VALUES
(1, 'admin', 'admin@library.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Admin User', 'ADMIN'),
(2, 'librarian', 'lib@library.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Librarian User', 'LIBRARIAN'),
(3, 'john_doe', 'john@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'John Doe', 'MEMBER'),
(4, 'jane_smith', 'jane@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Jane Smith', 'MEMBER'),
(5, 'bob_wilson', 'bob@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Bob Wilson', 'MEMBER'),
(6, 'alice_brown', 'alice@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Alice Brown', 'MEMBER'),
(7, 'charlie_day', 'charlie@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Charlie Day', 'MEMBER'),
(8, 'david_miller', 'david@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'David Miller', 'MEMBER'),
(9, 'eve_white', 'eve@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Eve White', 'MEMBER'),
(10, 'frank_green', 'frank@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Frank Green', 'MEMBER'),
(11, 'grace_blue', 'grace@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Grace Blue', 'MEMBER'),
(12, 'harry_potter', 'harry@example.com', '$2a$10$2VdGIx4whctzdoP.KPiYy.f7xIdGhU8ci2YnBgfInJRNvOwQl.bQe', 'Harry Potter', 'MEMBER');

-- Members
INSERT INTO members (user_id, membership_number, phone_number, address, membership_type, membership_start_date, membership_end_date, is_active) VALUES
(3, 'MEM001', '555-0101', '123 Main St', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true),
(4, 'MEM002', '555-0102', '456 Oak Ave', 'FACULTY', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true),
(5, 'MEM003', '555-0103', '789 Pine Rd', 'PUBLIC', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true),
(6, 'MEM004', '555-0104', '321 Elm St', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true),
(7, 'MEM005', '555-0105', '654 Maple Dr', 'PUBLIC', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true),
(8, 'MEM006', '555-0106', '987 Cedar Ln', 'FACULTY', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true),
(9, 'MEM007', '555-0107', '147 Birch Blvd', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true),
(10, 'MEM008', '555-0108', '258 Walnut Way', 'PUBLIC', DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH), DATE_ADD(CURRENT_DATE, INTERVAL 11 MONTH), true),
(11, 'MEM009', '555-0109', '369 Spruce Ct', 'STUDENT', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), false),
(12, 'MEM010', '555-0110', '741 Ash Pl', 'PUBLIC', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 1 YEAR), true);

-- Books
INSERT INTO books (book_id, isbn, title, author, publication_year, total_copies, available_copies) VALUES
(1, '978-0134685991', 'Effective Java', 'Joshua Bloch', 2018, 5, 5),
(2, '978-0321356680', 'Clean Code', 'Robert C. Martin', 2008, 3, 3),
(3, '978-0131103627', 'The C Programming Language', 'Brian W. Kernighan', 1988, 2, 2),
(4, '978-0201633610', 'Design Patterns', 'Erich Gamma', 1994, 4, 4),
(5, '978-0321125217', 'Domain-Driven Design', 'Eric Evans', 2003, 2, 2),
(6, '978-1617290459', 'Spring in Action', 'Craig Walls', 2018, 3, 3),
(7, '978-0451524935', '1984', 'George Orwell', 1949, 10, 10),
(8, '978-0743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 8, 8),
(9, '978-0061120084', 'To Kill a Mockingbird', 'Harper Lee', 1960, 6, 6),
(10, '978-0452284234', '1984 (Classic)', 'George Orwell', 1949, 5, 5),
(11, '978-0345391803', 'The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 1979, 4, 4),
(12, '978-0307474278', 'The Da Vinci Code', 'Dan Brown', 2003, 7, 7);

-- Borrowing Records
-- Active Borrowings
INSERT INTO borrowing_records (member_id, book_id, borrow_date, due_date, status, late_fee) VALUES
(1, 1, DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 9 DAY), 'BORROWED', 0),
(1, 2, DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 12 DAY), 'BORROWED', 0),

-- Returned Borrowings
(2, 3, DATE_SUB(CURRENT_DATE, INTERVAL 20 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), 'RETURNED', 0), 
(2, 4, DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 16 DAY), 'RETURNED', 2.00), -- Returned 1 day late

-- Overdue Borrowings (Active but late)
(3, 5, DATE_SUB(CURRENT_DATE, INTERVAL 20 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), 'BORROWED', 0), -- Due 6 days ago
(4, 6, DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), 'BORROWED', 0); -- Due yesterday

-- Update available copies to reflect borrowings
UPDATE books SET available_copies = available_copies - 1 WHERE book_id IN (1, 2, 5, 6);
