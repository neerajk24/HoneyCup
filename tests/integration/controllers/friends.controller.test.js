// test/integration/controllers/friends.controller.test.js

import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import sinon from "sinon";
import User from "../../../src/models/user.model.js";
import {
  addFriend,
  removeFriend,
  getFriends,
} from "../../../src/api/controllers/friends.controller.js";

describe("Friends Controller", function () {
  this.timeout(60000); // Increase timeout for all tests in this suite

  let mongoServer;
  let user1;
  let user2;

  before(async function () {
    this.timeout(60000); // Increase timeout for this hook
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

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

  after(async function () {
    this.timeout(60000); // Increase timeout for this hook
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async function () {
    this.timeout(60000); // Increase timeout for this hook
    await User.deleteMany({});
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

  describe("addFriend", () => {
    it("should add a friend successfully", async () => {
      const req = {
        body: {
          userId: user1._id.toString(),
          friendId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await addFriend(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: "Friend added successfully" })).to
        .be.true;

      const updatedUser = await User.findById(user1._id);
      expect(updatedUser.friends).to.include(user2._id);
    });

    it("should return 404 if user not found", async () => {
      const req = {
        body: {
          userId: new mongoose.Types.ObjectId().toString(), // Non-existing user ID
          friendId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await addFriend(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    });
  });

  describe("removeFriend", () => {
    it("should remove a friend successfully", async () => {
      // First add a friend
      user1.friends.push(user2._id);
      await user1.save();

      const req = {
        body: {
          userId: user1._id.toString(),
          friendId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await removeFriend(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: "Friend removed successfully" })).to
        .be.true;

      const updatedUser = await User.findById(user1._id);
      expect(updatedUser.friends).to.not.include(user2._id);
    });

    it("should return 404 if user not found", async () => {
      const req = {
        body: {
          userId: new mongoose.Types.ObjectId().toString(), // Non-existing user ID
          friendId: user2._id.toString(),
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await removeFriend(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    });
  });

  describe("getFriends", () => {
    it("should get the list of friends successfully", async () => {
      // First add a friend
      user1.friends.push(user2._id);
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

      await getFriends(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.args[0][0].friends[0]).to.have.property(
        "username",
        "user2"
      );
      expect(res.json.args[0][0].friends[0]).to.have.property(
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

      await getFriends(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    });
  });
});
