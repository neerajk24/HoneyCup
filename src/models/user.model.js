import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // Make email sparse for users signing in with providers that might not share email
  profilePhoto: String,
  galleryPhotos: [{ type: String }],
  bio: String,
  likes: [{ type: String }],
  dislikes: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
  },
  privacySettings: { shareLocation: Boolean, shareBio: Boolean },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  isActive: { type: Boolean, default: true },
  password: { type: String }, // No longer strictly required
  age: Number,
  sex: { type: String, enum: ['male', 'female', 'other'] },
  authMethods: [{ type: String, enum: ['email', 'google', 'apple', 'facebook'] }],
  googleId: String, // Google identifier
  appleId: String,  // Apple identifier
  facebookId: String, // Facebook identifier
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
