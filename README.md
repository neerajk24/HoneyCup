# HoneyCup

## Key Directory Descriptions:

- `/src`: The main source directory for all your application code.
- `/api`
    - `/controllers`: Contains classes or functions that handle client requests and send responses.
    - `/routes`: Defines the endpoints of your API and links them to the controller functions.
    - `/middlewares`: Holds middleware functions for tasks such as authentication, error handling, and request logging.
- `/config`: Stores configuration files, like database connection settings.
- `/services`: Encapsulates business logic, often injected into controllers.
- `/models`: Contains Mongoose schemas/models for your MongoDB database.
- `/lib/helpers`: Utility classes or functions used across your application.
- `/scripts`: Maintenance and operational scripts, such as database seeding.
- `/public`: Stores static files like images, stylesheets, and JavaScript files (if applicable).
- `/tests`: Contains your test suites and test cases.
- `/views`: If you decide to have server-rendered views, they would be stored here, but for a headless API used with a Flutter frontend, you may not need this.

## Chat 

/my-dating-app
  /src
    /api
      /controllers
        - chat.controller.js
      /routes
        - chat.routes.js
    /models
      - message.model.js
    /services
      - chat.service.js
    /middleware
      - chat.middleware.js (if needed for specific chat functionalities like auth)
    /config
      - socketio.config.js
    /constants
      - chat.constants.js (if you have specific constants related to chat)
    /scripts
      - setupDatabase.js (if additional setup is required)
  /tests
    /unit
    /integration
  .env
  package.json
  - app.js (You'll need to modify this for Socket.IO initialization)


Key File Details
chat.controller.js: This controller will handle incoming requests related to chat operations, like fetching message history. It interacts with the chat.service.js to process these requests.

chat.routes.js: Defines routes for chat-related endpoints. These routes will use the controller methods to handle requests.

message.model.js: Defines the schema for messages stored in your database. This should include properties like sender, receiver, message content, timestamp, etc.

chat.service.js: Contains the business logic for your chat features, such as sending messages, fetching chat history, deleting messages after 24 hours, and implementing the keyword alert system.

socketio.config.js: This configuration file will set up and export your Socket.IO instance. You'll integrate this with your main server setup in app.js to enable WebSocket communication.

chat.constants.js: (Optional) If your chat feature requires specific constants (e.g., event names, error codes), you can define them here for better maintainability.

app.js: You'll need to modify this file to initialize Socket.IO with your server. This involves importing the Socket.IO configuration and attaching it to your server instance.