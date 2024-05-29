// src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    googleId: String,
    facebookId: String,
    appleId: String,
    profilePhoto: String,
    galleryPhotos: [{ type: String }],
    bio: String,
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' },
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
        continueChat: { type: Boolean, default: false }
    }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blocked_users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    proximity_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // New field for proximity users
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

userSchema.methods.updateChatPreference = async function (otherUserId, continueChat) {
    const chattingWithUser = this.chattingWith.find(user => user.user.equals(otherUserId));
    if (chattingWithUser) {
        chattingWithUser.continueChat = continueChat;
        await this.save();
    }
};

userSchema.methods.addFriend = async function(friendId) {
    if (!this.friends.includes(friendId)) {
        this.friends.push(friendId);
        await this.save();
    }
};

userSchema.methods.removeFriend = async function(friendId) {
    this.friends = this.friends.filter(id => !id.equals(friendId));
    await this.save();
};

userSchema.methods.getFriends = async function() {
    const friends = await User.find({ _id: { $in: this.friends } });
    return friends;
};

userSchema.methods.addBlockedUser = async function(blockedUserId) {
    if (!this.blocked_users.includes(blockedUserId)) {
        this.blocked_users.push(blockedUserId);
        await this.save();
    }
};

userSchema.methods.removeBlockedUser = async function(blockedUserId) {
    this.blocked_users = this.blocked_users.filter(id => !id.equals(blockedUserId));
    await this.save();
};

userSchema.methods.getBlockedUsers = async function() {
    const blockedUsers = await User.find({ _id: { $in: this.blocked_users } });
    return blockedUsers;
};

userSchema.methods.addProximityUser = async function(proximityUserId) {
    if (!this.proximity_users.includes(proximityUserId)) {
        this.proximity_users.push(proximityUserId);
        await this.save();
    }
};

const User = mongoose.model('User', userSchema);
export default User;
