// tests/integration/controllers/blocked.controller.test.js

import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import sinon from "sinon";
import User from "../../../src/models/user.model.js";
import {
  addBlockedUser,
  removeBlockedUser,
  getBlockedUsers,
} from "../../../src/api/controllers/blocked.controller.js";

describe("Blocked Users Controller", () => {
  let mongoServer;
  let user1;
  let user2;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    user1 = new User({
      username: "user1",
      email: "user1@example.com",
      password: "password123",
    });
    user2 = new User({
      username: "user2",
      email: "user2@example.com",
      password: "password123",
    });

    await user1.save();
    await user2.save();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe("addBlockedUser", () => {
    it("should block a user successfully", async () => {
      const req = {
        body: {
          userId: user1._id.toString(),
          blockedUserId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await addBlockedUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: "User blocked successfully" })).to
        .be.true;

      const updatedUser = await User.findById(user1._id);
      expect(updatedUser.blocked_users).to.include(user2._id);
    });

    it("should return 404 if user not found", async () => {
      const req = {
        body: {
          userId: new mongoose.Types.ObjectId().toString(), // Non-existing user ID
          blockedUserId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await addBlockedUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    });
  });

  describe("removeBlockedUser", () => {
    it("should unblock a user successfully", async () => {
      // First block the user
      user1.blocked_users.push(user2._id);
      await user1.save();

      const req = {
        body: {
          userId: user1._id.toString(),
          blockedUserId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await removeBlockedUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: "User unblocked successfully" })).to
        .be.true;

      const updatedUser = await User.findById(user1._id);
      expect(updatedUser.blocked_users).to.not.include(user2._id);
    });

    it("should return 404 if user not found", async () => {
      const req = {
        body: {
          userId: new mongoose.Types.ObjectId().toString(), // Non-existing user ID
          blockedUserId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await removeBlockedUser(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    });
  });

  describe("getBlockedUsers", () => {
    it("should get the list of blocked users successfully", async () => {
      // First block the user
      user1.blocked_users.push(user2._id);
      await user1.save();

      const req = {
        params: {
          userId: user1._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getBlockedUsers(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.args[0][0].blockedUsers[0]).to.have.property(
        "username",
        "user2"
      );
      expect(res.json.args[0][0].blockedUsers[0]).to.have.property(
        "email",
        "user2@example.com"
      );
    });

    it("should return 404 if user not found", async () => {
      const req = {
        params: {
          userId: new mongoose.Types.ObjectId().toString(), // Non-existing user ID
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getBlockedUsers(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    });
  });
});
