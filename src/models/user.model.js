// src/models/user.model.js
import { Schema, model } from 'mongoose';
import { allowedLikes, allowedDislikes } from '../constants/likesdislikeconstants.js';
import { arrayLimit, arrayLimitLikesDislikes } from '../utils/validators.js';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  profilePhoto: String,
  galleryPhotos: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 2'] },
  bio: String,
  likes: { type: [{ type: String, enum: allowedLikes }], validate: [arrayLimitLikesDislikes, '{PATH} exceeds the limit'] },
  dislikes: { type: [{ type: String, enum: allowedDislikes }], validate: [arrayLimitLikesDislikes, '{PATH} exceeds the limit'] },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], index: '2dsphere' } },
  privacySettings: { shareLocation: Boolean, shareBio: Boolean },
  ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  isActive: { type: Boolean, default: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ['male', 'female', 'other'], required: true }
});

export default model('User', userSchema);
