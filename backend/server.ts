import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import adminRoutes from './routes/admin.routes';
import adminPanelRoutes from './routes/adminPanel.routes';
import publicRoutes from './routes/public.routes';
import courseRoutes from './routes/course.routes';
import feeStructureRoutes from './routes/feeStructure.routes';
import studentRoutes from './routes/student.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import paymentRoutes from './routes/payment.routes';
import connectDB from './config/database';
import { authenticateJWT } from './middleware/auth.middleware';
// Note: MongoDB doesn't require table creation - collections are created automatically

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Listen on all network interfaces
const HOST = '0.0.0.0';

// Custom middleware to parse text/plain as JSON
app.use((req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('text/plain')) {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(data);
      } catch (e) {
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory (production-safe)
const uploadsPath = path.join(__dirname, '..', 'uploads');
console.log('Uploads directory path:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Public Routes (No Authentication Required)
app.use('/api', publicRoutes);

// Public Course Routes
app.use('/api/courses', courseRoutes);
app.use('/api/fee-structures', feeStructureRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/payment', paymentRoutes);

// Admin Routes (Basic routes like login don't need authentication)
app.use('/api/admin', adminRoutes);

// Admin Panel Routes (Requires Authentication & Admin Role)
app.use('/api/admin', (req, res, next) => {
  // Skip authentication for login and setup routes
  if (req.path === '/login' || req.path === '/init-default' || req.path === '/setup') {
    return next();
  }
  authenticateJWT(req, res, next);
}, adminPanelRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Initialize database and start server
const initializeDatabase = async () => {
  try {
    // Try to connect to database (won't exit in development if it fails)
    await connectDB();

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory at:', uploadsDir);
    } else {
      console.log('Uploads directory already exists at:', uploadsDir);
    }

    const server = app.listen(PORT, HOST, () => {
      console.log(`✅ Server running successfully on port ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    // Handle server errors
    server.on('error', (error: unknown) => {
      if ((error as { code?: string })?.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to initialize database:', error);

    // In development, start server even without database
    if (process.env.NODE_ENV === 'development') {
      console.log('🚧 Starting server in development mode without database connection');

      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Created uploads directory at:', uploadsDir);
      } else {
        console.log('Uploads directory already exists at:', uploadsDir);
      }

      const server = app.listen(PORT, HOST, () => {
        console.log(`✅ Server running in development mode (no database)`);
        console.log(`🌐 Local: http://localhost:${PORT}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        console.log('⚠️  Some features may not work without database connection');
      });

      server.on('error', (error: unknown) => {
        if ((error as { code?: string })?.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} is already in use`);
        } else {
          console.error('❌ Server error:', error);
        }
        process.exit(1);
      });
    } else {
      // In production, exit if database connection fails
      process.exit(1);
    }
  }
};

initializeDatabase();

export default app;

