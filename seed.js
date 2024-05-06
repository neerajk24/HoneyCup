import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/user.model.js';

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/honeyCup');

    // Define longitude and latitude values
    const longitude1 = -74.006;
    const latitude1 = 40.7128;
    const longitude2 = -122.4194;
    const latitude2 = 37.7749;

    // Define user data to be seeded
    const userData = [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('password1', 12),
        profilePhoto: 'profile_photo_url_1',
        galleryPhotos: ['gallery_photo_url_11', 'gallery_photo_url_12'],
        bio: 'User 1 bio',
        likes: ['like11'],
        dislikes: ['dislike1', 'dislike2'],
        location: { type: 'Point', coordinates: [longitude1, latitude1] },
        privacySettings: { shareLocation: true, shareBio: false },
        isActive: true,
        age: 25,
        sex: 'male',
        authMethods: ['facebook'],
        googleId: 'google_id_1',
        appleId: 'apple_id_1',
        facebookId: 'facebook_id_1',
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('password2', 12),
        profilePhoto: 'profile_photo_url_2',
        galleryPhotos: ['gallery_photo_url_21', 'gallery_photo_url_22'],
        bio: 'User 2 bio',
        likes: ['like21', 'like22'],
        dislikes: ['dislike21'],
        location: { type: 'Point', coordinates: [longitude2, latitude2] },
        privacySettings: { shareLocation: true, shareBio: false },
        isActive: true,
        age: 27,
        sex: 'female',
        authMethods: ['google'],
        googleId: 'google_id_2',
        appleId: 'apple_id_2',
        facebookId: 'facebook_id_2',
      },
    ];

    // Insert the user data into the database
    const users = await User.insertMany(userData);

    // Update chattingWith field to create bidirectional references
    for (let i = 0; i < users.length; i++) {
      const currentUser = users[i];
      const otherUsers = users.filter(user => !user._id.equals(currentUser._id));
      currentUser.chattingWith = otherUsers.map(user => ({
        user: user._id,
        continueChat: false,
      }));
      await currentUser.save();
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.disconnect();
  }
};

seedUsers();
