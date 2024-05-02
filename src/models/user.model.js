// src/models/user.model.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    // Add fields for OAuth identifiers
    googleId: String,
    facebookId: String,
    appleId: String,
    // Remaining fields
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
    password: { type: String },
    age: Number,
    sex: { type: String, enum: ['male', 'female', 'other'] },
    authMethods: [{ type: String, enum: ['email', 'google', 'apple', 'facebook'] }],
    chattingWith: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        continueChat: { type: Boolean, default: false } // By default, chat is not persisted
    }]
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

// Function to update the continueChat field based on user preferences
userSchema.methods.updateChatPreference = async function (otherUserId, continueChat) {
    const chattingWithUser = this.chattingWith.find(user => user.user.equals(otherUserId));
    if (chattingWithUser) {
        chattingWithUser.continueChat = continueChat;
        await this.save();
    }
};

const User = mongoose.model('User', userSchema);
export default User;
