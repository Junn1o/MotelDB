# Motel Admin Dashboard

A comprehensive admin dashboard for managing motel operations, built with ReactJS, Material-UI, and Tailwind CSS. This application provides a user-friendly interface for motel administrators to manage rooms, customers, and other essential motel operations.

## 🌟 Features

- **Room Management**: Add, update, delete, and view room details
- **Customer Management**: Maintain customer records and booking history
- **User Authentication**: Secure admin login and access control
- **Real-time Updates**: Live data synchronization with the backend

## 🚀 Live Demo

**Live Application**: [moteldb.junnio.xyz/login](https://moteldb.junnio.xyz/login)

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js (v14 or higher)
- Access to the Motel API backend (see [API Repository](https://github.com/Junn1o/motelapi))

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Junn1o/MotelDB.git
   cd MotelDB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL="yourapiurl"
   REACT_APP_API="yourapiurl"
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
5. **Or using Docker (Recommended)**
   ```bash
   # Build and run with Docker
   docker build -t motel-room .
   docker run -p 3001:80 motel-room
   ```
The application will open at `http://localhost:3001`

## 🔗 Related Services

This admin dashboard works in conjunction with:

- **API Backend**: [Motel API](https://github.com/Junn1o/motelapi) - ASP.NET Core 7 REST API
- **Client Frontend**: [Motel Room Client](https://github.com/Junn1o/motel-room) - Customer-facing website

## 🛠️ Technology Stack

- **Frontend Framework**: React.js
- **UI Library**: Material-UI (MUI)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **Deployment**: Docker containerization, Cloudflared tunnel port expose
