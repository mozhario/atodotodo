import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const setupTestDB = async () => {
  // If already connected, disconnect first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Create in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri);
};

export const clearTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  }
};

export const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const setupTestSuite = () => {
  beforeAll(async () => {
    await setupTestDB();
  });
  
  afterEach(async () => {
    await clearTestDB();
  });
  
  afterAll(async () => {
    await closeTestDB();
  });
};