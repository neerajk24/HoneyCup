// tests/services/auth.service.test.js

import { expect } from "chai";
import * as authService from "../../src/services/auth.service.js";
import bcrypt from "bcryptjs";
import User from "../../src/models/user.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

describe("AuthService", function () {
  this.timeout(60000); // Increase timeout for all tests in this suite

  before(async function () {
    this.timeout(60000); // Increase timeout for this hook
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  });

  beforeEach(async function () {
    this.timeout(60000); // Increase timeout for this hook
    try {
      console.log("Deleting all users before each test...");
      await User.deleteMany({});
      console.log("Users deleted successfully.");
    } catch (error) {
      console.error("Error in beforeEach hook:", error);
    }
  });

  after(async function () {
    this.timeout(60000); // Increase timeout for this hook
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error("Error in after hook:", error);
    }
  });

  describe("authenticateUser", () => {
    it("should authenticate a user with correct credentials", async function () {
      this.timeout(20000); // Set timeout for this test case
      const newUser = await User.create({
        username: "testUser",
        email: "user@example.com",
        password: "password",
      });

      const result = await authService.authenticateUser(
        "user@example.com",
        "password"
      );
      expect(result).to.exist;
      expect(result.username).to.equal("testUser");
    });
  });

  describe("AuthService - Invalid Password", () => {
    it("should throw an error for invalid password", async function () {
      this.timeout(20000); // Set timeout for this test case
      const newUser = await User.create({
        username: "testUser2",
        email: "user2@example.com",
        password: bcrypt.hashSync("password", 8),
      });

      try {
        await authService.authenticateUser(
          "user2@example.com",
          "wrongpassword"
        );
        expect.fail(
          "Expected authenticateUser to throw an error for invalid password"
        );
      } catch (error) {
        expect(error.message).to.equal("Password is incorrect");
      }
    });
  });

  describe("AuthService - User Not Found", () => {
    it("should throw an error for user not found", async function () {
      this.timeout(20000); // Set timeout for this test case
      try {
        await authService.authenticateUser(
          "nonexistentuser@example.com",
          "password"
        );
        expect.fail(
          "Expected authenticateUser to throw an error for user not found"
        );
      } catch (error) {
        expect(error.message).to.equal("User not found");
      }
    });
  });
});
