# Backend Setup Instructions

1. Make sure you have XAMPP installed and running with MySQL.

2. Create a database named `student_data` in your MySQL server.

3. Run the following SQL to create the `students` table:

```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  studentId VARCHAR(100) NOT NULL,
  dormName VARCHAR(255) NOT NULL,
  roomNumber VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

4. Run the following SQL to create the `Food_Table`:

```sql
CREATE TABLE Food_Table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId VARCHAR(100) NOT NULL,
  mealType VARCHAR(50),
  usedTokens INT DEFAULT 0,
  remainingTokens INT DEFAULT 13,
  tokenWeekYear VARCHAR(20),
  UNIQUE KEY unique_student_week (studentId, tokenWeekYear)
);
```

5. Install backend dependencies:

```bash
cd backend
npm install
```

6. Start the backend server:

```bash
npm start
```

The backend server will run on port 5000.

Make sure to update the database connection details in `db.js` if your MySQL user or password is different.
