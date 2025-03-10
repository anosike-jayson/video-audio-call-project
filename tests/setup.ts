import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongoServer: MongoMemoryServer | undefined;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: "testdb",
        storageEngine: "wiredTiger",
      },
    });
    const uri = mongoServer.getUri();
    console.log("MongoMemoryServer URI:", uri);
    await mongoose.connect(uri, { connectTimeoutMS: 30000 });
  } catch (error) {
    console.error("MongoMemoryServer setup failed:", error);
    throw error; 
  }
}, 60000); 

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}, 10000);