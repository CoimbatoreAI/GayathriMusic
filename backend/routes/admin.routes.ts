import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model';

interface DecodedToken {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

const router = express.Router();

// Admin login
router.post('/login', async (req, res): Promise<void> => {
  try {
    console.log('🔐 LOGIN ROUTE HIT - Request received');
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        error: 'Username and password are required',
        code: 'MISSING_CREDENTIALS'
      });
      return;
    }

    // Find admin by username
    console.log('🔍 Looking for admin with username:', username);
    const admin = await Admin.findOne({ username, isActive: true });
    console.log('👤 Admin found:', !!admin);
    console.log('👤 Admin details:', admin ? {
      id: admin._id,
      username: admin.username,
      role: admin.role,
      isActive: admin.isActive,
      passwordLength: admin.password.length
    } : 'No admin found');

    if (!admin) {
      // Check if any admin exists - if not, suggest running setup
      const adminCount = await Admin.countDocuments();
      console.log('📊 Total admin count:', adminCount);

      if (adminCount === 0) {
        res.status(404).json({
          error: 'No admin user found. Please run the database initialization script first.',
          code: 'NO_ADMIN_FOUND',
          suggestion: 'Run: npm run init-db'
        });
        return;
      }

      console.log('❌ Admin not found with that username');
      res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Check password
    console.log('🔐 Comparing passwords...');
    console.log('🔑 Provided password length:', password.length);
    console.log('🔑 Stored password hash length:', admin.password.length);

    const isValidPassword = await admin.comparePassword(password);
    console.log('✅ Password valid:', isValidPassword);
    console.log('🔐 Password comparison details:', {
      provided: password,
      storedHash: admin.password.substring(0, 20) + '...',
      bcryptResult: isValidPassword
    });

    if (!isValidPassword) {
      console.log('❌ Password comparison failed');
      console.log('❌ This suggests either:');
      console.log('   1. Wrong password provided');
      console.log('   2. Password not hashed correctly during creation');
      console.log('   3. Issue with bcrypt comparison');

      res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET || 'e2d3a419a2102590838d0a9ae031114a70255b45be2f02a7923e6f8e27e37aac9b65673a553cf2e43e4abee6bc12b7e36f10990629eecbf9b21c2b13af2ae10b',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);

    // Handle MongoDB permission errors specifically
    if (error instanceof Error && error.message.includes('user is not allowed to do action')) {
      res.status(503).json({
        error: 'Database permission error. Please contact the system administrator.',
        code: 'DATABASE_PERMISSION_ERROR',
        details: 'The database user does not have sufficient permissions to access admin data.'
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Verify admin token
router.get('/verify', async (req, res): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'e2d3a419a2102590838d0a9ae031114a70255b45be2f02a7923e6f8e27e37aac9b65673a553cf2e43e4abee6bc12b7e36f10990629eecbf9b21c2b13af2ae10b') as DecodedToken;

    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    res.json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Create default admin (one-time setup)
router.post('/setup', async (req, res): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        error: 'Username, email, and password are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
      return;
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      res.status(400).json({
        error: 'Admin already exists',
        code: 'ADMIN_EXISTS'
      });
      return;
    }

    const admin = new Admin({
      username,
      email,
      password,
      role: 'super_admin'
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin setup error:', error);

    // Handle MongoDB permission errors specifically
    if (error instanceof Error && error.message.includes('user is not allowed to do action')) {
      res.status(503).json({
        error: 'Database permission error. Please check MongoDB Atlas permissions for the database user.',
        code: 'DATABASE_PERMISSION_ERROR',
        details: 'The database user does not have sufficient permissions to create admin records.'
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to create admin',
      code: 'SETUP_FAILED'
    });
  }
});

// Initialize with default admin (alternative method)
router.post('/init-default', async (req, res): Promise<void> => {
  try {
    const defaultUsername = 'admin@gayathrithulasi';
    const defaultEmail = 'admin@gayathrithulasi';
    const defaultPassword = 'gayathrithulasi';

    console.log('🔧 Initializing default admin...');
    console.log('👤 Username:', defaultUsername);
    console.log('📧 Email:', defaultEmail);

    // Always delete existing admins for fresh start
    console.log('🗑️ Deleting all existing admins...');
    await Admin.deleteMany({});
    console.log('✅ All existing admins deleted');

    console.log('👤 Creating new admin...');
    const admin = new Admin({
      username: defaultUsername,
      email: defaultEmail,
      password: defaultPassword,
      role: 'super_admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    console.log('🔍 Verifying admin in database...');

    // Verify the admin was saved
    const savedAdmin = await Admin.findOne({ username: defaultUsername });
    console.log('💾 Admin found in DB:', !!savedAdmin);
    if (savedAdmin) {
      console.log('💾 Admin ID:', savedAdmin._id);
      console.log('💾 Admin password hash length:', savedAdmin.password.length);
      console.log('💾 Admin role:', savedAdmin.role);
      console.log('💾 Admin isActive:', savedAdmin.isActive);

      // Test password comparison directly
      console.log('🔐 Testing password comparison...');
      const isPasswordValid = await savedAdmin.comparePassword(defaultPassword);
      console.log('🔐 Password comparison result:', isPasswordValid);
    } else {
      console.log('❌ Admin not found in database after creation!');
    }

    res.status(201).json({
      success: true,
      message: 'Default admin created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Default admin initialization error:', error);

    // Handle MongoDB permission errors specifically
    if (error instanceof Error && error.message.includes('user is not allowed to do action')) {
      res.status(503).json({
        error: 'Database permission error. Please check MongoDB Atlas permissions.',
        code: 'DATABASE_PERMISSION_ERROR',
        solution: 'Go to MongoDB Atlas > Network Access > Add IP Address > 0.0.0.0/0, then Database > Manage > Add Database User with read/write permissions'
      });
      return;
    }

    res.status(500).json({
      error: 'Failed to initialize default admin',
      code: 'INIT_FAILED'
    });
  }
});

export default router;
