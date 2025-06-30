// Backend Configuration
// Update this URL to match your backend server address
export const BACKEND_CONFIG = {
  // Development
  development: {
    baseURL: 'https://gokrixo.onrender.com',
    timeout: 10000,
  },
  
  // Production
  production: {
    baseURL: 'https://gokrixo.onrender.com',
    timeout: 10000,
  },
  
  // Test
  test: {
    baseURL: 'https://gokrixo.onrender.com',
    timeout: 5000,
  }
};

// Get current environment - simplified for browser compatibility
const getEnvironment = () => {
  // For now, always use development config in browser
  // You can manually change this if needed
  return 'development';
};

// Export current config
export const currentConfig = BACKEND_CONFIG[getEnvironment()];

// API Endpoints
export const API_ENDPOINTS = {
  // Commands
  CREATE_COMMAND: '/CreateCommand',
  GET_COMMANDS: '/GetCommands',
  
  // Workers
  CREATE_WORKER: '/CreateWorker',
  GET_WORKERS: '/GetWorkers',
  
  // Authentication
  REGISTRATION: '/Regestration',
  LOGIN: '/login',
  GET_ACCOUNT: '/account',
  
  // Health check
  HEALTH: '/health',
};

// Backend setup instructions:
/*
1. Make sure your backend server is running on the correct port
2. Update the baseURL in this file to match your backend URL
3. Ensure CORS is properly configured on your backend
4. Test the connection using the /api-test route

Backend CORS configuration example (Node.js/Express):
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

Backend CORS configuration example (Python/Flask):
from flask_cors import CORS
CORS(app, origins=['http://localhost:5173'])

Backend CORS configuration example (Python/Django):
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
*/ 