# FLEXICA3 - Lost & Found Board

A community notice board for lost and found items built with Node.js, Express, MongoDB (Mongoose), and plain HTML/CSS/JS.

---

## How to Run

### Step 1: Open Terminal in the `server` directory
```bash
cd server
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start the server
```bash
node server.js
```

### Step 4: Open in Browser
Visit **http://localhost:3000** in any browser.

---

## Database Configuration
- The app connects to local MongoDB at `mongodb://127.0.0.1:27017/flexica3` by default, or to any custom connection string specified in the `MONGO_URI` environment variable.
- If no MongoDB instance is currently running, the server automatically starts an in-memory database fallback so that all features (creating posts, filtering, toggling returned status, and deleting) work out of the box without any setup.
