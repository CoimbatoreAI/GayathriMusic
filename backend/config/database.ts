import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection configuration
const connectDB = async (): Promise<void> => {
  try {
    // Use MongoDB Atlas connection string from environment variable
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Gayathri_Music:gayathrimusic@cluster1.tthp2v5.mongodb.net/carnatic_music_school?retryWrites=true&w=majority&appName=Cluster1';

    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Always use MongoDB Atlas, even in development
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    console.log('MongoDB URI:', mongoURI.replace(/:[^:]+@/, ':****@')); // Hide password in logs

    // Connection options for better reliability
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect(mongoURI, options);

    console.log('✅ Successfully connected to MongoDB Atlas');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'Connected'}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:', error);

    if (process.env.NODE_ENV === 'production') {
      console.error('💡 For production, ensure MongoDB Atlas is accessible and IP is whitelisted');
      process.exit(1);
    } else {
      console.error('💡 For local development:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB Atlas cluster is running');
      console.error('   3. Check Atlas Network Access settings');
      console.error('   4. Verify database user credentials');
      console.error('   5. Update MONGODB_URI in .env file if needed');

      // Don't exit in development, allow the app to start in demo mode
      console.log('🚧 Starting server in demo mode without database connection');
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
