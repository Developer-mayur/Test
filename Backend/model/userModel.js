import mongoose from "mongoose";
let UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique:true,
    required: true,
  },
  passward: {
    type: String,
    required: true,
  },
  resetToken: {type: String},
  resetTokenexpire: Date
});


const User =mongoose.model("user",UserSchema);
export default User;