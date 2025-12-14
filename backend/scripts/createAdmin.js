import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    const adminData = {
      name: "Admin User",
      email: "admin@sweetshop.com",
      password: "admin123",
      role: "admin",
    };
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      process.exit(1);
    }
    const admin = await User.create(adminData);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

createAdmin();
