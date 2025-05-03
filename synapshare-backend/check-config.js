// Simple script to check server configuration
require('dotenv').config();

console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('FIREBASE_SERVICE_ACCOUNT exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT);
console.log('API_URL:', process.env.API_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
