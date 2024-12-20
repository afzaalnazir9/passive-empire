import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    console.log("mongo uri :>> ", process.env.MONGO_URI)

    const conn = await mongoose.connect(process.env.MONGO_URI, 
      {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsCAFile: "global-bundle.pem"
    }
  );

    console.log(`MongoDB Connected: ${conn}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exit(1);  // Terminate the process if the connection fails
  }
};

export default connectDB;
