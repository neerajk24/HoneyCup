import { Schema as _Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const { hash, compare } = bcrypt;
const Schema = _Schema;

// Define allowed values for likes and dislikes
const allowedLikes = ['movies', 'music', 'sports', 'books', 'travel'];
const allowedDislikes = ['cold weather', 'fast food', 'crowded places', 'loud music', 'waiting in lines'];

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true
  },
  profilePhoto: String, // URL to the primary image file
  galleryPhotos: {
    type: [String], // URLs to the gallery images
    validate: [arrayLimit, '{PATH} exceeds the limit of 2'] // Custom validator for max 2 photos
  },
  bio: String,
  likes: {
    type: [{
      type: String,
      enum: allowedLikes, // Use the defined allowed values for likes
    }],
    validate: [arrayLimitLikesDislikes, '{PATH} exceeds the limit'] // Optionally limit the number of selections
  },
  dislikes: {
    type: [{
      type: String,
      enum: allowedDislikes, // Use the defined allowed values for dislikes
    }],
    validate: [arrayLimitLikesDislikes, '{PATH} exceeds the limit'] // Optionally limit the number of selections
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  privacySettings: {
    shareLocation: Boolean,
    shareBio: Boolean
  },
  ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  isActive: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password']
  },
  age: {
    type: Number,
    required: [true, 'Please provide an age']
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please provide a sex']
  }
});

// Custom validator functions
function arrayLimit(val) {
  return val.length <= 2;
}

function arrayLimitLikesDislikes(val) {
  return val.length <= 5; // Example limit, adjust as needed
}

// Pre-save hook to hash the password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password, 12);
  next();
});

// Method to check the password on login
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await compare(candidatePassword, this.password);
};

export default model('User', userSchema);
