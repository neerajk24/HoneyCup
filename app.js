/**
 * This is the main file for the server application.
 * It sets up the server, connects to the database, and defines routes and middleware.
 */
// app.js

import express from "express";
import connectDatabase from "./src/config/database.js";
import authRoutes from "./src/api/routes/auth.route.js";
import userRoutes from "./src/api/routes/user.route.js";
import mediaRoutes from "./src/api/routes/media.route.js";
import chatRoutes from "./src/api/routes/chat.route.js";
import blockRoutes from "./src/api/routes/blocked.route.js";
import friendRoutes from "./src/api/routes/friends.route.js";
import passport from "passport";
import "./src/config/passport-setup.js";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import net from "net";

const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        reject(err);
      }
    });

    server.once("listening", () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });
};

const createApp = () => {
  const app = express();

  // Connect to MongoDB
  connectDatabase();

  // Middleware setup
  app.use(express.json());
  app.use(cors());
  app.use(passport.initialize());

  // Define routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/media", mediaRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/blocked", blockRoutes);
  app.use("/api/friends", friendRoutes);

  // Swagger setup
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "HoneyCup API",
        version: "1.0.0",
        description: "Documentation for the HoneyCup API",
      },
    },
    apis: ["./src/api/routes/*.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  return app;
};

const startServer = async () => {
  const app = createApp();
  const portPrimary = process.env.PORT || 3000;
  const portFallback = 4000;

  try {
    const isPortPrimaryAvailable = await checkPort(portPrimary);
    let portToUse = portPrimary;

    if (!isPortPrimaryAvailable) {
      console.log(
        `Port ${portPrimary} is already in use. Trying port ${portFallback}...`
      );
      const isPortFallbackAvailable = await checkPort(portFallback);

      if (!isPortFallbackAvailable) {
        throw new Error(
          `Both port ${portPrimary} and port ${portFallback} are in use. Please free up a port.`
        );
      }

      portToUse = portFallback;
    }

    app.listen(portToUse, () => {
      console.log(`Server running on port ${portToUse}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export { createApp };
