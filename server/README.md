# 🚀 Evangadi Forum Backend Setup Guide

This guide will help you get the project up and running smoothly on your local machine. Follow these steps to start contributing or testing the backend API.

---

## 📦 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MySQL** (XAMPP, MAMP, WAMP or standalone installation)

---

## 🛠️ Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mihret7/Evangadi-Forum
   cd Evangadi-Forum
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   - Copy the sample environment file and update it with your credentials:
     ```bash
     cp .env.sample .env
     ```
   - Edit `.env` and set your MySQL credentials (default values are provided for XAMPP):
     ```env
     DB_HOST=localhost
     DB_USER=evangadi_admin
     DB_PASSWORD=password
     DB_NAME=evangadi_forum
     DB_CONNECTION_LIMIT=10
     ```

4. **Start MySQL Server**

   - If using XAMPP, open the XAMPP Control Panel and start the MySQL service.

5. **Run App and Initialize the Database**

   - Initially since there is not db yet, please don't forget to comment out the line code on number 9 inside app.js which is `const result = await dbconnection.execute("SELECT 'test'");`

     5.1. **Start the Backend Server**

   ```bash
    node app.js
   # or for development with auto-reload
   npx nodemon app.js # install nodemon first
   ```

   - The server will run at: [http://localhost:5400](http://localhost:5400)

   - Run the following endpoint in your browser or with a tool like Postman to create the database and user:
     ```
     http://localhost:5400/initdb
     ```
   - You should see a success message if everything is set up correctly.

6. **Create Tables**
   - First uncomment the previous line code, and continue development.
   - Run the following endpoint to create all necessary tables:
     ```
     http://localhost:5400/create
     ```

---

## 🧑‍💻 Useful Tips

- If you change your database credentials, update your `.env` file accordingly.
- For troubleshooting, check the terminal output for errors and ensure MySQL is running.
- Use tools like Postman or Insomnia to test your API endpoints.

---

## 🤝 Contributing

- Please read the `COLLABORATION.md` file for detailed collaboration instructions!
- Feel free to open issues or submit pull requests.

---

Happy coding Team! ✨
