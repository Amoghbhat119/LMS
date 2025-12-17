Learning Management System (LMS)

A full-stack Learning Management System built using the MERN stack (MongoDB, Express, React, Node.js).

This repository contains both frontend and backend code.

Prerequisites

Ensure the following are installed on your system:

Node.js (v18 or above)

npm

Git

MongoDB Atlas account (or local MongoDB)

Clone the Repository
git clone https://github.com/Amoghbhat119/LMS.git
cd LMS

Backend Setup

Navigate to backend folder:

cd backend


Install dependencies:

npm install


Create a .env file inside the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Seed Admin User (IMPORTANT)

The project includes a seed admin file to create the initial Admin account.

From the backend folder, run:

node seedAdmin.js


This will create an Admin user in the database.

⚠️ Run this only once.
Running it multiple times may create duplicate admin users.

Use this Admin account to log in and manage:

Teachers

Students

Classes

Subjects

Start Backend Server
npm run dev


Backend will run on:

http://localhost:5000

Frontend Setup

Open a new terminal

Navigate to frontend folder:

cd frontend


Install dependencies:

npm install


Start frontend server:

npm run dev


Frontend will run on:

http://localhost:5173

Running the Application

Ensure both backend and frontend are running

Open browser and visit:

http://localhost:5173


Log in using the Admin account created via seedAdmin

Create Teachers, Students, Classes, and assign roles via Admin dashboard

Project Structure (Overview)
LMS/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── seedAdmin.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
└── README.md

Notes

MongoDB connection must be valid

Backend and frontend must run simultaneously

Attendance and materials update automatically via UI

No manual database editing required