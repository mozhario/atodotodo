import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import app from './app.js';

// Load environment variables
dotenv.config();

// Log environment
logger.info('Starting application...');
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
logger.info(`PORT: ${process.env.PORT || 8080}`);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }); 