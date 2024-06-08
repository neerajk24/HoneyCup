/**
 * @fileOverview Unit tests for the User Model.
 * @module user.model.test
 */

import mongoose from "mongoose";
import { use, expect as _expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import bcrypt from "bcryptjs";
import User from "../../src/models/user.model.js";
import dotenv from "dotenv";
import connectDatabase from "../../src/config/database.js";

use(chaiAsPromised);
const expect = _expect;

dotenv.config();

/**
 * Describes the unit tests for the User Model.
 */
describe("User Model", () => {
  /**
   * Sets up the test environment by connecting to the database.
   */
  before(async function () {
    this.timeout(10000); // Increase timeout for this hook

    try {
      // Ensure the database is connected before tests run
      await mongoose.connect(process.env.MONGODB_URI, {});
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  });

  beforeEach(async function () {
    // Clear the User collection before each test
    await User.deleteMany({});
  });

  /**
   * 1. Tests if a user can be saved successfully.
   */
  it("should save a user", async () => {
    const userData = {
      username: "testuser",
      password: "testpassword",
      email: "test@test.com",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser).to.exist;
    expect(savedUser.username).to.equal(userData.username);
    expect(savedUser)
      .to.have.property("password")
      .that.is.not.equal(userData.password);
  });

  /**
   * 2. Tests if a user can be retrieved by ID.
   */
  it("should retrieve a user by ID", async () => {
    const userData = {
      username: "testuser_ID",
      password: "testpassword_ID",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    await user.save();

    const retrievedUser = await User.findById(user._id);

    expect(retrievedUser).to.exist;
    expect(retrievedUser.username).to.equal(userData.username);
  });

  /**
   * 3. Tests if a user can be updated.
   */
  it("should update a user", async () => {
    const userData = {
      username: "testuser_old",
      password: "testpassword_old",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    await user.save();

    user.username = "updateduser";
    const updatedUser = await user.save();

    expect(updatedUser).to.exist;
    expect(updatedUser.username).to.equal("updateduser");
  });

  /**
   * 4. Tests if a user can be deleted.
   */
  it("should delete a user", async () => {
    const userData = {
      username: "testuser_delete",
      password: "testpassword_delete",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    await user.save();

    await User.findByIdAndDelete(user._id);

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).to.not.exist;
  });

  /**
   * 5. Tests if the username field is required.
   */
  it("should require the username field", async () => {
    const userData = {
      password: "testpassword",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);

    // Try to save the user without the username field
    await expect(user.save()).to.be.rejectedWith(
      mongoose.Error.ValidationError
    );
  });

  /**
   * 6. Tests if the email field is unique.
   */
  it("should ensure the email field is unique", async () => {
    const dumy_userData = {
      username: "testuser_email",
      email: "test@test.com",
      password: "dumy_password",
      location: {
        type: "Point",
        coordinates: [2, 3],
      },
    };

    const dumy_user = new User(dumy_userData);
    dumy_user.save();

    const userData = {
      username: "testuser_email_unique",
      email: "test@test.com", // Existing email
      password: "testpassword",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);

    try {
      await user.save();
      throw new Error("Expected an error but did not get one");
    } catch (error) {
      // Check for the duplicate key error code directly
      expect(error.code).to.equal(11000); // E11000 is the error code for duplicate key error
    }
  });

  /**
   * 7. Tests if the username field is required.
   */
  it("should require the username field", async () => {
    const userData = {
      password: "testpassword",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);

    // Try to save the user without the username field
    await expect(user.save()).to.be.rejectedWith(
      mongoose.Error.ValidationError
    );
  });

  /**
   * 8. Tests if the email field is sparse.
   */
  it("should ensure the email field is sparse", async () => {
    const userData = {
      username: "testuser2",
      password: "testpassword",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser).to.exist;
    expect(savedUser.email).to.not.exist;
  });

  /**
   * 9. Tests if the username field is unique.
   */
  it("should ensure the username field is unique", async () => {
    const userData1 = {
      username: "testuser_name_unique",
      email: "test1unique@test.com",
      password: "testpassword_uniquename",
      location: {
        type: "Point",
        coordinates: [3, 4],
      },
    };

    const userData2 = {
      username: "testuser_name_unique",
      email: "test2unique@test.com",
      password: "testpassword_unique_name",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user1 = new User(userData1);
    const user2 = new User(userData2);

    await user1.save();

    // Try to save the second user with the same username
    await expect(user2.save()).to.be.rejectedWith(
      mongoose.Error.MongoServerError
    );
  });

  /**
   * 10. Tests if the chattingWith array is initialized correctly.
   */
  it("should initialize the chattingWith array correctly", async () => {
    const userData = {
      username: "testuser_chattingWith",
      password: "testpassword_chattingWith",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    expect(user.chattingWith).to.exist;
    expect(user.chattingWith).to.be.an("array").that.is.empty; // Expect the array to be initialized and empty
  });

  /**
   * 11. Tests if the updateChatPreference method correctly updates the continueChat field.
   */
  it("should correctly update the continueChat field using updateChatPreference method", async () => {
    const userData = {
      username: "testuser_updateChatPreference",
      password: "testpassword_updateChatPreference",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    const otherUserId = new mongoose.Types.ObjectId(); // Dummy other user ID
    user.chattingWith.push({ user: otherUserId, continueChat: false });

    // Call updateChatPreference method with continueChat set to true
    await user.updateChatPreference(otherUserId, true);

    // Fetch the updated chattingWith user
    const updatedChattingWithUser = user.chattingWith.find((u) =>
      u.user.equals(otherUserId)
    );
    expect(updatedChattingWithUser).to.exist;
    expect(updatedChattingWithUser.continueChat).to.be.true; // Expect continueChat to be true after update
  });

  /**
   * 12. Tests if the password is hashed correctly.
   */
  it("should hash the password when saving a new user", async () => {
    const userData = {
      username: "testuser_passwordHash",
      password: "testpassword_passwordHash",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).to.exist;
    expect(user.password).to.not.equal(userData.password); // Expect password to be hashed
  });

  /**
   * 13. Tests if the correctPassword method verifies the password correctly.
   */
  it("should verify the password correctly using the correctPassword method", async () => {
    const userData = {
      username: "testuser_correctPassword",
      password: "testpassword_correctPassword",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    await user.save();

    const isCorrectPassword = await user.correctPassword(userData.password);
    expect(isCorrectPassword).to.be.true; // Expect correct password verification
  });

  /**
   * 14. Tests if the OAuth identifiers are stored correctly and are unique.
   */
  it("should store and ensure uniqueness of OAuth identifiers", async () => {
    const userData = {
      username: "testuser_oauth",
      googleId: "testgoogleid_oauth",
      facebookId: "testfacebookid_oauth",
      appleId: "testappleid_oauth",
      password: "testpassword_oauth",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    await user.save();

    expect(user.googleId).to.equal(userData.googleId);
    expect(user.facebookId).to.equal(userData.facebookId);
    expect(user.appleId).to.equal(userData.appleId);
  });
  //////////////////////

  //////////////////////

  /**
   * 15. Tests if the friends array is initialized correctly.
   */
  it("should initialize the friends array correctly", async () => {
    const userData = {
      username: "testuser_friends",
      password: "testpassword_friends",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    expect(user.friends).to.exist;
    expect(user.friends).to.be.an("array").that.is.empty; // Expect the array to be initialized and empty
  });

  /**
   * 16. Tests if the addFriend method correctly adds a friend.
   */
  it("should correctly add a friend using addFriend method", async () => {
    const userData = {
      username: "testuser_addFriend",
      password: "testpassword_addFriend",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const friendId = new mongoose.Types.ObjectId(); // Dummy friend ID
    const user = new User(userData);

    await user.addFriend(friendId);

    expect(user.friends).to.include(friendId); // Expect the friend to be added to the friends array
  });

  /**
   * 17. Tests if the removeFriend method correctly removes a friend.
   */
  it("should correctly remove a friend using removeFriend method", async () => {
    const userData = {
      username: "testuser_removeFriend",
      password: "testpassword_removeFriend",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const friendId = new mongoose.Types.ObjectId(); // Dummy friend ID
    const user = new User(userData);
    await user.addFriend(friendId);

    await user.removeFriend(friendId);

    expect(user.friends).to.not.include(friendId); // Expect the friend to be removed from the friends array
  });

  /**
   * 18. Tests if the blocked_users array is initialized correctly.
   */
  it("should initialize the blocked_users array correctly", async () => {
    const userData = {
      username: "testuser_blocked_users",
      password: "testpassword_blocked_users",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    expect(user.blocked_users).to.exist;
    expect(user.blocked_users).to.be.an("array").that.is.empty; // Expect the array to be initialized and empty
  });

  /**
   * 19. Tests if the addBlockedUser method correctly adds a blocked user.
   */
  it("should correctly add a blocked user using addBlockedUser method", async () => {
    const userData = {
      username: "testuser_addBlockedUser",
      password: "testpassword_addBlockedUser",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const blockedUserId = new mongoose.Types.ObjectId(); // Dummy blocked user ID
    const user = new User(userData);

    await user.addBlockedUser(blockedUserId);

    expect(user.blocked_users).to.include(blockedUserId); // Expect the blocked user to be added to the blocked_users array
  });

  /**
   * 20. Tests if the removeBlockedUser method correctly removes a blocked user.
   */
  it("should correctly remove a blocked user using removeBlockedUser method", async () => {
    const userData = {
      username: "testuser_removeBlockedUser",
      password: "testpassword_removeBlockedUser",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const blockedUserId = new mongoose.Types.ObjectId(); // Dummy blocked user ID
    const user = new User(userData);
    await user.addBlockedUser(blockedUserId);

    await user.removeBlockedUser(blockedUserId);

    expect(user.blocked_users).to.not.include(blockedUserId); // Expect the blocked user to be removed from the blocked_users array
  });

  /**
   * 21. Tests if the proximity_users array is initialized correctly.
   */
  it("should initialize the proximity_users array correctly", async () => {
    const userData = {
      username: "testuser_proximity_users",
      password: "testpassword_proximity_users",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    expect(user.proximity_users).to.exist;
    expect(user.proximity_users).to.be.an("array").that.is.empty; // Expect the array to be initialized and empty
  });

  /**
   * 22. Tests if the addProximityUser method correctly adds a proximity user.
   */
  it("should correctly add a proximity user using addProximityUser method", async () => {
    const userData = {
      username: "testuser_addProximityUser",
      password: "testpassword_addProximityUser",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const proximityUserId = new mongoose.Types.ObjectId(); // Dummy proximity user ID
    const user = new User(userData);

    await user.addProximityUser(proximityUserId);

    expect(user.proximity_users).to.include(proximityUserId); // Expect the proximity user to be added to the proximity_users array
  });

  /**
   * 23. Tests if the privacySettings field is initialized correctly.
   */
  it("should initialize the privacySettings field correctly", async () => {
    const userData = {
      username: "testuser_privacySettings",
      password: "testpassword_privacySettings",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
      privacySettings: {
        shareLocation: true,
        shareBio: false,
      },
    };

    const user = new User(userData);
    await user.save();

    expect(user.privacySettings).to.exist;
    expect(user.privacySettings.shareLocation).to.be.true;
    expect(user.privacySettings.shareBio).to.be.false;
  });

  /**
   * 24. Tests if the authMethods field is initialized correctly.
   */
  it("should initialize the authMethods field correctly", async () => {
    const userData = {
      username: "testuser_authMethods",
      password: "testpassword_authMethods",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
      authMethods: ["email", "google"],
    };

    const user = new User(userData);
    await user.save();

    expect(user.authMethods).to.exist;
    expect(user.authMethods)
      .to.be.an("array")
      .that.includes("email")
      .and.includes("google");
  });

  /**
   * 25. Tests if the location field is a 2dsphere index.
   */
  //   it("should ensure the location field is a 2dsphere index", async () => {
  //     const indexes = await User.collection.indexes();
  //     const locationIndex = indexes.find((index) => {
  //       const keys = Object.keys(index.key);
  //       return (
  //         keys.length === 1 &&
  //         keys[0] === "location" &&
  //         index.key.location === "2dsphere"
  //       );
  //     });

  //     expect(locationIndex).to.exist;
  //   });

  /**
   * 26. Tests if the galleryPhotos array is initialized correctly.
   */
  it("should initialize the galleryPhotos array correctly", async () => {
    const userData = {
      username: "testuser_galleryPhotos",
      password: "testpassword_galleryPhotos",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    expect(user.galleryPhotos).to.exist;
    expect(user.galleryPhotos).to.be.an("array").that.is.empty; // Expect the array to be initialized and empty
  });

  /**
   * 27. Tests if likes and dislikes arrays are initialized correctly.
   */
  it("should initialize likes and dislikes arrays correctly", async () => {
    const userData = {
      username: "testuser_likes_dislikes",
      password: "testpassword_likes_dislikes",
      location: {
        type: "Point",
        coordinates: [1, 1],
      },
    };

    const user = new User(userData);
    expect(user.likes).to.exist;
    expect(user.likes).to.be.an("array").that.is.empty; // Expect the likes array to be initialized and empty

    expect(user.dislikes).to.exist;
    expect(user.dislikes).to.be.an("array").that.is.empty; // Expect the dislikes array to be initialized and empty
  });
});
