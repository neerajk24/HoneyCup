// src/models/user.model.js

 import mongoose from 'mongoose';
 import bcrypt from 'bcryptjs';
 
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
     }],
     friends: [{ type: Schema.Types.ObjectId, ref: 'User' }] // New field for storing friends
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
 
 // Method to add a friend
 userSchema.methods.addFriend = async function(friendId) {
     if (!this.friends.includes(friendId)) {
         this.friends.push(friendId);
         await this.save();
     }
 };
 
 // Method to remove a friend
 userSchema.methods.removeFriend = async function(friendId) {
     this.friends = this.friends.filter(id => !id.equals(friendId));
     await this.save();
 };
 
 // Method to get list of friends
 userSchema.methods.getFriends = async function() {
     const friends = await User.find({ _id: { $in: this.friends } });
     return friends;
 };
 
 const User = mongoose.model('User', userSchema);
 export default User;
