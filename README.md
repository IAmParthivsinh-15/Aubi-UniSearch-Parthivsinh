# Aubergine - University Search & Analytics Application

A full-stack web application for searching, filtering, and analyzing universities worldwide. Built with React, Express.js, and MongoDB.

---

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Routes Documentation](#api-routes-documentation)
- [Frontend Features](#frontend-features)
- [Database](#database)

---

## 📁 Project Structure

```
Aubergine/
├── Backend/
│   ├── server.js                 # Express server entry point
│   ├── package.json              # Backend dependencies
│   ├── data.json                 # University data (10,191 records)
│   ├── models/
│   │   └── University.js         # Mongoose schema definition
│   ├── controllers/
│   │   └── universityController.js  # API business logic
│   ├── routes/
│   │   └── universityRoutes.js   # Route definitions
│   └── db.js                     # Database utilities & auto-import
│
├── Frontend/
│   └── aubi/
│       ├── package.json
│       ├── vite.config.js
│       ├── tailwind.config.js
│       ├── index.html
│       ├── src/
│       │   ├── main.jsx          # React entry point
│       │   ├── App.jsx           # Root component
│       │   ├── App.css           # Main styles
│       │   ├── index.css         # Tailwind & global styles
│       │   ├── Components/
│       │   │   ├── UniversitySearch.jsx  # Main search component
│       │   │   └── Analytics.jsx        # Analytics dashboard
│       │   └── assets/
│       └── public/
│
└── README.md                     # This file
```

---

## ✨ Features

### Level 1: Basic Search
- Country-based university search
- Autocomplete search functionality
- Display university details (name, country, province, website)
- Real-time filtering

### Level 3: Province Filtering
- Dynamic province/state dropdown
- Filter universities by province after selecting country
- Province statistics and breakdown

### Level 4: Download
- Download university cards as JPEG images
- Individual card download functionality
- Automatic file naming with university name

### Analytics Dashboard
- Total universities, countries, and provinces statistics
- Top 15 countries by university count (bar chart)
- Website availability statistics (pie chart)
- Country-wise detailed analytics
- Provinces breakdown for selected country
- Universities list per country

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v24.11.1+)
- **Framework:** Express.js (^4.18.2)
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose (^9.0.1)
- **Middleware:** CORS (^2.8.5)
- **Development:** Nodemon (^3.0.1)

### Frontend
- **Library:** React (^19.2.0)
- **Build Tool:** Vite (^7.2.4)
- **Styling:** Tailwind CSS (^3.3.0)
- **Charts:** Recharts (for analytics)
- **Export:** html2canvas (^1.4.1) for JPEG download
- **CSS Processing:** PostCSS (^8.4.24), Autoprefixer (^10.4.14)

### Database
- **MongoDB Atlas** - Cloud MongoDB instance
- **Database:** Aubergine
- **Collection:** universities (10,191 documents)
- **Auto-import:** First run automatically imports data from data.json

---

## 📦 Prerequisites

Before running the application, ensure you have:

- **Node.js** (v24.11.1 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** (Free tier is sufficient)
- **Internet Connection** (for MongoDB Atlas connection)

Verify installation:
```powershell
node --version
npm --version
```

---

## 🚀 Installation & Setup

### 1. Clone/Navigate to Project

```powershell
cd c:\Users\My PC\OneDrive\Desktop\Aubergine
```

### 2. Backend Setup

```powershell
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file (optional, for custom port)
# PORT=5001
```

**Backend Dependencies will install:**
- express (Web framework)
- cors (Cross-origin requests)
- mongoose (MongoDB connection)
- nodemon (Auto-restart on file changes)

### 3. Frontend Setup

```powershell
# Navigate to Frontend directory
cd ..\Frontend\aubi

# Install dependencies
npm install

# Install Tailwind CSS (if not already installed)
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind config (if needed)
npx tailwindcss init -p
```

**Frontend Dependencies will install:**
- react (UI library)
- vite (Build tool)
- tailwindcss (Styling)
- recharts (Charts for analytics)
- html2canvas (JPEG export)

---

## ▶️ Running the Application

You need to run **both backend and frontend** simultaneously for the app to work.

### Start Backend Server

```powershell
# From Backend directory
cd Backend
npm start

# Output should show:
# Server running on port 5001
# MongoDB connected successfully
# Auto-importing universities data (first run only)...
```

The backend will:
- Connect to MongoDB Atlas
- Auto-import 10,191 universities from data.json (first run only)
- Start listening on `http://localhost:5001`

### Start Frontend Server (in another terminal)

```powershell
# From Frontend directory
cd Frontend\aubi
npm run dev

# Output should show:
# VITE v7.2.4 ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🔌 API Routes Documentation

All API endpoints are prefixed with `/api`

### Base URL
```
http://localhost:5001/api
```

---

### 📍 University Routes

#### 1. Get All Countries
- **Method:** `GET`
- **Endpoint:** `/countries`
- **Description:** Retrieve all available countries
- **Response:**
```json
[
  "India",
  "United States",
  "Canada",
  "United Kingdom",
  ...
]
```

---

#### 2. Get Provinces by Country
- **Method:** `GET`
- **Endpoint:** `/provinces/:country`
- **Description:** Get all provinces/states for a specific country
- **Parameters:**
  - `:country` (URL parameter) - Country name (must be URL encoded)
- **Example:**
```
GET /provinces/India
GET /provinces/United%20States
```
- **Response:**
```json
[
  "Punjab",
  "Maharashtra",
  "Karnataka",
  "Delhi",
  ...
]
```

---

#### 3. Get Universities (with filters)
- **Method:** `GET`
- **Endpoint:** `/universities`
- **Description:** Get universities with optional country and province filtering
- **Query Parameters:**
  - `country` (optional) - Filter by country
  - `province` (optional) - Filter by province/state
- **Limit:** Maximum 100 results per request
- **Examples:**
```
GET /universities?country=India
GET /universities?country=India&province=Punjab
GET /universities?country=United%20States&province=California
```
- **Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "University of Delhi",
    "country": "India",
    "state-province": "Delhi",
    "domains": ["www.du.ac.in"],
    "web_pages": ["http://www.du.ac.in/"],
    "alpha_two_code": "IN"
  },
  ...
]
```

---

#### 4. Get Single University by Name
- **Method:** `GET`
- **Endpoint:** `/university/:name`
- **Description:** Retrieve a specific university by exact name match
- **Parameters:**
  - `:name` (URL parameter) - University name (must be URL encoded)
- **Example:**
```
GET /university/University%20of%20Delhi
```
- **Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "University of Delhi",
  "country": "India",
  "state-province": "Delhi",
  "domains": ["www.du.ac.in"],
  "web_pages": ["http://www.du.ac.in/"],
  "alpha_two_code": "IN",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

#### 5. Search Universities (Partial Match)
- **Method:** `GET`
- **Endpoint:** `/search`
- **Description:** Full-text search universities by partial name match
- **Query Parameters:**
  - `q` (required) - Search query string
- **Limit:** Maximum 50 results
- **Examples:**
```
GET /search?q=Delhi
GET /search?q=Indian%20Institute
```
- **Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "University of Delhi",
    "country": "India",
    "domains": ["www.du.ac.in"],
    "web_pages": ["http://www.du.ac.in/"]
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Delhi Technological University",
    "country": "India",
    "domains": ["www.dtu.ac.in"],
    "web_pages": ["http://www.dtu.ac.in/"]
  },
  ...
]
```

---

### 📊 Analytics Routes

#### 1. Get Analytics Statistics
- **Method:** `GET`
- **Endpoint:** `/analytics/stats`
- **Description:** Get overall statistics about universities
- **Response:**
```json
{
  "totalUniversities": 10191,
  "totalCountries": 195,
  "totalProvinces": 1850
}
```

---

#### 2. Get Universities Count by Country
- **Method:** `GET`
- **Endpoint:** `/analytics/universities-by-country`
- **Description:** Get count of universities per country, sorted by highest count
- **Response:**
```json
[
  {
    "_id": "India",
    "count": 1120
  },
  {
    "_id": "United States",
    "count": 1050
  },
  {
    "_id": "China",
    "count": 890
  },
  ...
]
```

---

#### 3. Get Website Availability Statistics
- **Method:** `GET`
- **Endpoint:** `/analytics/website-stats`
- **Description:** Get statistics about universities with and without websites
- **Response:**
```json
{
  "withWebsite": 9500,
  "withoutWebsite": 691,
  "percentage": 93
}
```

---

#### 4. Get Country Provinces & Universities
- **Method:** `GET`
- **Endpoint:** `/analytics/provinces/:country`
- **Description:** Get detailed analytics for a specific country including provinces and universities list
- **Parameters:**
  - `:country` (URL parameter) - Country name (must be URL encoded)
- **Example:**
```
GET /analytics/provinces/India
GET /analytics/provinces/United%20States
```
- **Response:**
```json
{
  "country": "India",
  "totalInCountry": 1120,
  "provinces": [
    {
      "_id": "Delhi",
      "count": 98
    },
    {
      "_id": "Maharashtra",
      "count": 156
    },
    ...
  ],
  "universities": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "University of Delhi",
      "state-province": "Delhi",
      "web_pages": ["http://www.du.ac.in/"]
    },
    ...
  ]
}
```

---

#### 5. Health Check
- **Method:** `GET`
- **Endpoint:** `/health`
- **Description:** Check if the server is running and database is connected
- **Response:**
```json
{
  "status": "Server is running",
  "database": "MongoDB connected"
}
```

---

## 🎨 Frontend Features

### University Search Component (`/`)
- **Search by Country:** Type and autocomplete country selection
- **Filter by Province:** Dynamic dropdown appears after country selection
- **Live Statistics:** Shows selected country, province, and result count
- **University Cards:** Display:
  - University name
  - Country
  - Province/State
  - Website link
  - Domains list
  - Download button (JPEG export)
- **Error Handling:** Shows user-friendly error messages
- **Loading States:** Spinner while fetching data

### Analytics Dashboard (`/analytics`)
- **Overview Cards:**
  - Total universities
  - Total countries
  - Total provinces
- **Charts:**
  - Top 15 countries bar chart
  - Website availability pie chart
- **Country Details:**
  - Select country from dropdown
  - View total universities count
  - Provinces distribution chart
  - Universities table (first 10 with "more" indicator)
- **Key Insights:**
  - Average universities per country
  - Average provinces per country
  - Website coverage percentage

---

## 💾 Database

### Auto-Import Feature

On first run, the backend automatically:
1. Checks if the `universities` collection is empty
2. Reads data from `Backend/data.json` (10,191 records)
3. Inserts all universities into MongoDB
4. Creates indexes on `name`, `country`, and `state-province` fields for fast queries

**This happens only once** - subsequent runs skip the import.

### Schema Structure

```javascript
{
  "_id": ObjectId,
  "name": String,
  "country": String,
  "alpha_two_code": String,
  "state-province": String,
  "domains": [String],
  "web_pages": [String],
  "createdAt": Date,
  "updatedAt": Date
}
```

### Indexed Fields

- `name` - For university name searches
- `country` - For country filtering
- `state-province` - For province filtering

---

## 🌐 API Integration in Frontend

**Base URL Configuration:**
```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

**All API calls are made from:**
- `Frontend/aubi/src/Components/UniversitySearch.jsx`
- `Frontend/aubi/src/Components/Analytics.jsx`

---

## 🎯 Usage Examples

### Example 1: Search Universities in India

```bash
# Get all countries
curl http://localhost:5001/api/countries

# Get provinces in India
curl http://localhost:5001/api/provinces/India

# Get universities in India
curl http://localhost:5001/api/universities?country=India

# Get universities in Punjab, India
curl http://localhost:5001/api/universities?country=India&province=Punjab
```

### Example 2: View Analytics

```bash
# Get overall stats
curl http://localhost:5001/api/analytics/stats

# Get universities per country
curl http://localhost:5001/api/analytics/universities-by-country

# Get website statistics
curl http://localhost:5001/api/analytics/website-stats

# Get India analytics
curl http://localhost:5001/api/analytics/provinces/India
```

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB Atlas credentials are correct
- Check internet connection (required for MongoDB Atlas)
- Verify Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

### Frontend won't load
- Ensure backend is running on port 5001
- Check if port 5173 is available (use `npm run dev -- --port 3000` for different port)
- Clear browser cache and hard refresh (Ctrl+F5)

### API calls failing
- Ensure backend is running and connected to MongoDB
- Check browser console for CORS errors
- Verify MongoDB Atlas IP whitelist includes your machine

### Data not importing
- Check `Backend/data.json` exists
- Ensure MongoDB collection is empty (first run)
- Check backend logs for import errors


---

## 🔒 Security Notes

- MongoDB credentials are embedded for demo purposes only
- In production, use environment variables for credentials
- Implement authentication/authorization for API endpoints
- Add rate limiting to prevent abuse
- Validate and sanitize all user inputs

---

## 📄 License

This project is for educational purposes.

---
