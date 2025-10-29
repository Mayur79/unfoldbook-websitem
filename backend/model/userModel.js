const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Demo User" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, 
     googleId: { type:String},
     role:{ type: String,
    enum: ['user', 'admin'],
    default:'user'
     }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
