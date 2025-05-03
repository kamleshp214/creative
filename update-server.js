const fs = require('fs');
const path = require('path');

// Path to server.js file
const serverFilePath = path.join(__dirname, 'synapshare-backend', 'server.js');

// Read the file
console.log('Reading server.js...');
let serverContent = fs.readFileSync(serverFilePath, 'utf8');

// Define the base URL constant to use
const baseUrlDefinition = `
// Base URL for file serving - use environment variable or default to localhost
const BASE_URL = process.env.API_URL || "http://localhost:" + (process.env.PORT || 5000);
`;

// Replace all hardcoded localhost URLs
console.log('Replacing hardcoded URLs...');
serverContent = serverContent.replace(/http:\/\/localhost:5000/g, '${BASE_URL}');

// Add the BASE_URL definition after dotenv.config()
console.log('Adding BASE_URL definition...');
serverContent = serverContent.replace(
  'dotenv.config();',
  'dotenv.config();\n' + baseUrlDefinition
);

// Enhance CORS configuration
console.log('Enhancing CORS configuration...');
const corsConfig = `
// Configure CORS
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = \`The CORS policy for this site does not allow access from the specified Origin: \${origin}\`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
`;

// Replace simple CORS setup with enhanced version
serverContent = serverContent.replace(
  'app.use(cors());',
  corsConfig
);

// Enhance MongoDB connection
console.log('Enhancing MongoDB connection...');
const mongoConfig = `
// MongoDB Connection with improved configuration
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    // Exit with failure in production to trigger container restart
    if (process.env.NODE_ENV === 'production') {
      console.error("Exiting due to MongoDB connection failure");
      process.exit(1);
    }
  });

// Handle MongoDB disconnection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});
`;

// Replace simple MongoDB connection with enhanced version
serverContent = serverContent.replace(
  /\/\/ MongoDB Connection\nmongoose\n\s+\.connect\(process\.env\.MONGO_URI\)\n\s+\.then\(\(\) => console\.log\("MongoDB connected"\)\)\n\s+\.catch\(\(err\) => console\.error\("MongoDB connection error:", err\)\);/,
  mongoConfig
);

// Add security imports
console.log('Adding security imports...');
const securityImports = `
// Import security packages
let helmet, rateLimit;
try {
  helmet = require("helmet");
  rateLimit = require("express-rate-limit");
} catch (err) {
  console.log("Optional security dependencies not installed");
}
`;

// Insert security imports after the existing imports
serverContent = serverContent.replace(
  'const axios = require("axios");\n',
  'const axios = require("axios");\n' + securityImports
);

// Add security middleware
console.log('Adding security middleware...');
const securityMiddleware = `
// Apply security middleware if available
if (helmet) {
  app.use(helmet());
}

// Apply rate limiting if available
if (rateLimit) {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });
  app.use('/api/', apiLimiter);
}
`;

// Insert security middleware after app initialization
serverContent = serverContent.replace(
  'app.use(express.json());\n',
  'app.use(express.json());\n' + securityMiddleware
);

// Write the updated content back to the file
console.log('Writing updated server.js...');
fs.writeFileSync(serverFilePath, serverContent);

console.log('Server.js has been updated successfully!');
