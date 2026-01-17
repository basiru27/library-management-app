# Library Management System

A robust backend implementation of a Library Management System built with Java and Spring Boot. This application handles user authentication, book management, member profiles, and borrowing workflows.

## Features

- **User Authentication**: JWT-based security with role-based access control (Admin, Librarian, Member).
- **Book Management**: CRUD operations for books with inventory tracking and search capabilities.
- **Member Management**:
  - Auto-creation of member profiles upon user registration.
  - Admin/Librarian management of member details.
  - Membership type tracking (Student, Faculty, Public).
- **Borrowing System**:
  - Check-out and return books.
  - Automatic overdue calculation and late fee tracking.
  - Borrowing history logging.
- **Data Seeding**: Pre-populated database with sample data for quick start and testing.

## Tech Stack

- **Java**: 17
- **Framework**: Spring Boot 3.2.1
- **Database**: MySQL 8
- **ORM**: Hibernate / Spring Data JPA
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

## Setup & Installation

### Prerequisites
- JDK 17+ installed.
- MySQL Server installed and running.
- Maven installed (optional, wrapper included).

### Configuration
1.  Configure your MySQL database in `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/library_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD
    ```

### Running the Application
1.  **Clone the repository**:
    ```bash
    git clone git@github.com:basiru27/library-management-app.git
    cd library-management-app
    ```
2.  **Build and Run**:
    ```bash
    ./mvnw spring-boot:run
    ```
    The application will start on `http://localhost:8080`.

## API Usage

The API is secured with JWT. 
1.  **Register/Login** to get a token (`/api/auth/register` or `/api/auth/login`).
2.  Include the token in the `Authorization` header of subsequent requests: `Bearer <your_token>`.

### Key Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Books**: `/api/books` (GET, POST, PUT, DELETE)
- **Members**: `/api/members` (GET, POST, PUT), `/api/members/{id}/borrowing-history`
- **Borrowing**: `/api/borrowing/borrow`, `/api/borrowing/return/{id}`

*A Postman collection is included in the project artifacts for detailed testing.*

## Database Seeding

The application automatically seeds the database with sample users and books on startup (when `spring.jpa.hibernate.ddl-auto=create`).

**Default Users:**
- **Admin**: `admin` / `password`
- **Librarian**: `librarian` / `password`
- **Member**: `john_doe` / `password`

## Frontend Application

The project includes a modern React-based frontend located in the `client/` directory.

### Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Frontend Features
- **Dashboard**: Role-specific stats and activity feed.
- **Book Management**: Searchable book catalog with availability status.
- **Member Management**: Admin tools to register and manage members.
- **Borrowing System**: Streamlined "Issue Book" modal with autocomplete for Books and Members.
- **Role-Based Access**:
  - **Admin**: Full access to Member, Book management.
  - **Librarian**: Access to Borrowing, Returns, and Overdue tracking.
  - **Member**: View-only access to available books.

### Running the Frontend
1.  **Navigate to client directory**:
    ```bash
    cd client
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The frontend will start on `http://localhost:5173` (by default).

### Default Credentials for Testing Frontend
- **Admin**: `admin` / `password`
- **Librarian**: `librarian` / `password`
- **Member**: `john_doe` / `password`
