import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import app from './app.js';

dotenv.config();

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
  }); 