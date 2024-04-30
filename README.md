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

# Chat idea on which Rajat Intern working on :-

## chatting_with:
 - Each user model will have a field named chatting_with, which will contain an array of objects representing the users with whom the current user is chatting.
 - Each object in the array will contain the userID and a boolean value indicating whether the chat with that user should be kept or deleted after 24 hours.
 - For example, if User A is chatting with User B and both have agreed to keep the chat, the chatting_with field for User A will contain an object like { userID: 'B', keepChat: true }.
 - If User A is also chatting with User C but has not agreed to keep the chat, the chatting_with field for User A will contain another object like { userID: 'C', keepChat: false }.
 - Similarly, User B's chatting_with field will contain an object representing User A with the agreed state of keeping the chat.
## Default State:
 - By default, when a new chat is initiated, the chatting_with field for both users will contain objects with the keepChat value set to false.
 - This means that by default, the chat will be deleted after 24 hours unless both users explicitly agree to keep it.
## Chat Persistence:
 - To ensure that the chat remains after 24 hours, both users must have objects in their respective chatting_with arrays with each other's user IDs and the keepChat value set to true.
 - If either user does not have the other user's ID in their chatting_with array or if the keepChat value is set to false, the chat will be deleted after 24 hours.
 - Overall, this approach provides a structured way to track the users with whom each user is chatting and their agreed-upon decision regarding whether to keep the chat or delete it after 24 hours. It ensures that both users must mutually agree to keep the chat for it to persist beyond the default 24-hour period.

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
