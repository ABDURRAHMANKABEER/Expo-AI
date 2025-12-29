import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // VERY IMPORTANT for security
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  console.log("Password before hashing:", this.password);
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  console.log("Password after hashing:", this.password);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  console.log("Comparing passwords:");
  console.log("Entered:", enteredPassword);
  console.log("Stored hash:", this.password);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log("Match result:", isMatch);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

export default User;