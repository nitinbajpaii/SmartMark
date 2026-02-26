# SmartMark - Smart Attendance System

SmartMark is a modern, efficient, and user-friendly smart attendance system designed to streamline the process of tracking attendance using QR codes. It features a multi-role architecture supporting Students, Teachers, and Mentors.

## 🚀 Features

- **QR Code Attendance**: Seamlessly mark attendance by scanning QR codes.
- **Role-Based Access Control**: Tailored dashboards and functionalities for Students, Teachers, and Mentors.
- **Real-time Tracking**: Live session management and attendance monitoring.
- **Modern UI/UX**: Built with React, Tailwind CSS, and Vite for a fast and responsive experience.
- **Secure Authentication**: Robust login and signup flow with persistent user sessions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **QR Scanning**: [jsQR](https://github.com/cozmo/jsQR)
- **QR Generation**: [qrcode](https://github.com/soldair/node-qrcode)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ID Generation**: [uuid](https://github.com/uuidjs/uuid)
- **Data Storage**: JSON-based persistent storage

## 📂 Project Structure

```text
SmartMark/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth & Global State
│   │   ├── layouts/      # Page layouts (Dashboard, etc.)
│   │   ├── pages/        # Route components (Student, Teacher, Mentor)
│   │   └── services/     # API communication logic
│   └── vercel.json       # Vercel deployment configuration
├── backend/              # Node.js + Express API
│   ├── controllers/      # Route handlers
│   ├── data/             # JSON data storage
│   ├── routes/           # API route definitions
│   └── server.js         # Entry point
└── vercel.json           # Root Vercel configuration
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/nitinbajpai/SmartMark.git
cd SmartMark
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will start on `http://localhost:4000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## 🌐 Deployment

### Frontend (Vercel)
The frontend is configured for deployment on Vercel. It includes a `vercel.json` with rewrite rules to handle React Router's client-side routing on page refreshes.

### Backend (Render)
The backend is ready to be deployed on Render or any Node.js hosting platform. Ensure you set the `PORT` environment variable if required.

## 📝 License
This project is private and intended for internal use.
