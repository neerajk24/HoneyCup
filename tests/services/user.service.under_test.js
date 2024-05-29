// tests/services/user.service.test.js

import assert from 'assert';
import bcrypt from 'bcryptjs';
import * as userService from '../../src/services/user.service.js';
import { createUser, findNearbyUsers } from '../../src/services/user.service.js';
import User from '../../src/models/user.model.js';
import mongoose from 'mongoose';

describe('User Service', () => {
    describe('hashPassword', () => {
        it('should hash the password', async () => {
            const password = 'testPassword';
            const hashedPassword = 'hashedPassword';

            // Mocking bcrypt.hash
            bcrypt.hash = async () => hashedPassword;

            const result = await userService.hashPassword(password);

            assert.strictEqual(await bcrypt.hash(password, 12), hashedPassword);
            assert.strictEqual(result, hashedPassword);
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userData = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            };
            const user = await createUser(userData);
            assert.strictEqual(user.username, 'testuser');
            assert.strictEqual(user.email, 'testuser@example.com');
            assert.strictEqual(typeof user.password, 'string');
            assert.notStrictEqual(user.password, 'password123'); // Password should be hashed
            assert.strictEqual(user.location.type, 'Point');
            assert.strictEqual(user.location.coordinates.length, 2);
        });
    });

    describe('findNearbyUsers', () => {
        before(async () => {
            // Connect to the test database
            await mongoose.connect('mongodb://localhost:27017/honeyCup', { useNewUrlParser: true, useUnifiedTopology: true });
            await User.deleteMany({});
        });

        after(async () => {
            // Clean up the database and close the connection
            await User.deleteMany({});
            await mongoose.connection.close();
        });

        it('should find users within a 5 km radius and update proximity_users', async () => {
            // Create three users with specific locations
            const user1 = await createUser({ username: 'user1', email: 'user1@example.com', password: 'password123' });
            user1.location.coordinates = [0, 0]; // Example coordinates
            await user1.save();

            const user2 = await createUser({ username: 'user2', email: 'user2@example.com', password: 'password123' });
            user2.location.coordinates = [0.04, 0.04]; // Within 5 km
            await user2.save();

            const user3 = await createUser({ username: 'user3', email: 'user3@example.com', password: 'password123' });
            user3.location.coordinates = [100, 100]; // More than 5 km away
            await user3.save();

            // Find nearby users for user1
            const nearbyUsers = await findNearbyUsers(user1._id, [0, 0]);

            // Assertions
            assert.strictEqual(nearbyUsers.length, 1);
            assert.strictEqual(nearbyUsers[0].username, 'user2');

            const updatedUser1 = await User.findById(user1._id);
            assert(updatedUser1.proximity_users.includes(user2._id));
            assert(!updatedUser1.proximity_users.includes(user3._id));
        });
    });
});
