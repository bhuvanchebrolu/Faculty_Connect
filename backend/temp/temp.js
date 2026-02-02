import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

// ─── MongoDB Connection ──────────────────────────────
const MONGO_URI = "mongodb://127.0.0.1:27017/faculty-connect"; // change DB name if needed

mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// ─── Function to create a user ───────────────────────
async function createUser({ name, email, password, role, extraFields = {} }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    ...extraFields,
  });

  await user.save();
  console.log(`✅ Created ${role}: ${name} (${email})`);
}

// ─── Create 3 users ─────────────────────────────────
async function main() {
  try {
    // Optional: delete existing users first
    await User.deleteMany({});

    await createUser({
      name: "John Student",
      email: "student1@nitt.edu.in",
      password: "student123",
      role: "student",
      extraFields: {
        rollNumber: "STU001",
        year: 3,
        branch: "CSE",
      },
    });

    await createUser({
      name: "Dr. Alice Prof",
      email: "prof1@nitt.edu.in",
      password: "prof123",
      role: "professor",
      extraFields: {
        department: "Computer Science",
        designation: "Assistant Professor",
      },
    });

    await createUser({
      name: "Admin Bob",
      email: "admin1@nitt.edu.in",
      password: "admin123",
      role: "admin",
    });

    console.log("🎉 All users created successfully!");
    process.exit(0); // exit script
  } catch (err) {
    console.error("Error creating users:", err);
    process.exit(1);
  }
}

main();
