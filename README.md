# ==============================
# MERN School Management System Setup Guide
# ==============================

# 1️⃣ Clone the Repository
git clone https://github.com/Amoghbhat119/LMS.git

# 2️⃣ Go Inside the Project Folder
cd LMS

# 3️⃣ Install Backend Dependencies
cd backend
npm install

# 4️⃣ Create a .env File inside backend/
# (use any text editor like VS Code or Notepad)
# Example:
# -------------------------
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/school
# -------------------------

# 5️⃣ Start the Backend Server
npm start
# You should see:
# Server started on port 5000
# MongoDB connected

# 6️⃣ Open a New Terminal Window (don’t close backend)
# Go to the frontend folder
cd ../frontend

# 7️⃣ Install Frontend Dependencies
npm install

# 8️⃣ Start the Frontend
npm start
# It will open automatically at http://localhost:3000

# ==============================
# ✅ Login or Register Admin
# ==============================
# - Go to Admin Register page
# - Enter name, email, password, and school name
# - Click Register to create the first admin account

# ==============================
# ✅ Ports
# ==============================
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000

# ==============================
# ✅ Troubleshooting
# ==============================
# If you get “Port already in use” on 5000:
# Run this in PowerShell or Git Bash:
# netstat -ano | findstr :5000
# taskkill /PID <PID> /F

# If MongoDB not connected:
# Ensure MongoDB service is running locally or use Atlas URI
# Example Atlas URI:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/school

# ==============================
# ✅ Done!
# ==============================
# The project should now run with:
# - Backend: npm start (in backend folder)
# - Frontend: npm start (in frontend folder)
