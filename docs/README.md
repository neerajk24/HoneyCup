# HoneyCup
## Running and testing commands :-
#### Starting the server              -> node app.js
#### Test all files                 -> npm run testall-combined
#### Testing stubbed testing file   -> npm run jest-testall
#### Testing normal testing file    -> npm run testall

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

## Chat Idea :-
- Idea on Chatting_with Field: Each object: { userID, keepChat } . Example: { userID: 'B', keepChat: true }.
- Default State: New chats: keepChat set to false. , Default: Chats deleted after 24 hours.
- Chat Persistence: Both users must set keepChat to true. , If either sets keepChat to false, chat is deleted after 24 hours.
- Mutual Agreement: Chat remains only if both users agree. , Structured tracking of chat agreements.

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

- chat.controller.js: Handles incoming chat requests (fetch history, etc.). Interacts with chat.service.js.
- chat.routes.js: Defines chat API endpoints. Uses controller methods to handle requests.
- message.model.js: Defines the schema for messages (sender, receiver, content, timestamp).
- chat.service.js: Contains chat business logic (send messages, fetch history, delete messages, keyword alerts).
- socketio.config.js: Configures and exports the Socket.IO instance (integrated in app.js).
- chat.constants.js (Optional): Defines chat-specific constants for better maintainability (event names, error codes).
- app.js: Modified for Socket.IO initialization (imports configuration, attaches to server).

Authentication
- Flutter App:
- Use Firebase Authentication SDK for login/signup/logout.
- Obtain the Firebase ID token after successful authentication.

Node.js Backend:
- Set up Firebase Admin SDK.
- Verify the Firebase ID token received from the client (middleware).
- Generate and manage session tokens if needed.

chat.controller.js: This controller will handle incoming requests related to chat operations, like fetching message history. It interacts with the chat.service.js to process these requests.

chat.routes.js: Defines routes for chat-related endpoints. These routes will use the controller methods to handle requests.

message.model.js: Defines the schema for messages stored in your database. This should include properties like sender, receiver, message content, timestamp, etc.

chat.service.js: Contains the business logic for your chat features, such as sending messages, fetching chat history, deleting messages after 24 hours, and implementing the keyword alert system.

socketio.config.js: This configuration file will set up and export your Socket.IO instance. You'll integrate this with your main server setup in app.js to enable WebSocket communication.

chat.constants.js: (Optional) If your chat feature requires specific constants (e.g., event names, error codes), you can define them here for better maintainability.

app.js: You'll need to modify this file to initialize Socket.IO with your server. This involves importing the Socket.IO configuration and attaching it to your server instance.


Authentication

Initial Authentication in Flutter: Use Firebase Authentication in the Flutter app for initial login/signup. This allows you to take advantage of Firebase's easy-to-use authentication methods and real-time updates.
Token Management in Node.js: After the user is authenticated, send the Firebase ID token to your Node.js backend for validation. Your backend can then generate its own session token or use the Firebase ID token for subsequent API requests.
Implementation Steps
Flutter:

Use Firebase Authentication SDK to handle user sign-up, login, and logout.
Obtain the Firebase ID token after successful authentication.
Node.js Backend:

Set up Firebase Admin SDK in your Node.js server.
Create a middleware to verify the Firebase ID token received from the client.
Generate and manage session tokens if needed.
