import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Record from "./models/record.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected securely!");

    console.log("Clearing old data...");
    await User.deleteMany({});
    await Record.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    console.log("Creating Admin, Analyst, and Viewer users...");
    const users = await User.insertMany([
      { name: "John Admin", email: "admin@test.com", password: hashedPassword, role: "admin", status: "active" },
      { name: "Sarah Analyst", email: "analyst@test.com", password: hashedPassword, role: "analyst", status: "active" },
      { name: "Mike Viewer", email: "viewer@test.com", password: hashedPassword, role: "viewer", status: "active" }
    ]);

    const adminId = users[0]._id;

    console.log("Generating financial records...");
    const records = [];
    const categories = {
      income: ["salary", "freelance", "investment_return"],
      expense: ["rent", "groceries", "utilities", "software_subscriptions"]
    };

    for (let i = 0; i < 20; i++) {
      const type = Math.random() > 0.4 ? "expense" : "income"; 
      
      const categoryList = categories[type];
      const category = categoryList[Math.floor(Math.random() * categoryList.length)];
      
      const amount = type === "income" 
        ? Math.floor(Math.random() * 40000) + 10000 
        : Math.floor(Math.random() * 5000) + 500;

      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 90));

      records.push({
        user: adminId, 
        amount,
        type,
        category,
        date: pastDate,
        note: `Generated ${category} record for testing`,
        isDeleted: false
      });
    }

    await Record.insertMany(records);
    console.log(`Successfully seeded database with 3 Users and 20 Financial Records!`);
    
    process.exit();

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
