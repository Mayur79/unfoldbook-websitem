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
     },
       wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentModel",
      },
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentModel",
      },
    ],
     purchasedDocs: [{ type: mongoose.Schema.Types.ObjectId, ref: "DocumentModel" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
