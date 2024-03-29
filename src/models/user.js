const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true
  },
  profilePhoto: String, // URL to the image file
  bio: String,
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
  }
});

// Pre-save hook to hash the password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Auto-generate a salt and hash
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check the password on login
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


