# Socket IO (Real-time Message Implementation)

This document explains the usage of Socket.io in the real-time messaging part for the dating app. The application facilitates real-time messaging between users, allowing them to join chat rooms and send messages.

Socket IO is used in 2 parts in our application:

- Frontend
- Backend

## Sockets: (Frontend and Backend)

- **Frontend**: There are 4 types of socket listeners and emitters which are used in our frontend. Let's see them one by one.

  1. **recieveMessage**(listener): This socket is used to receive real-time messages from the Socket.io server.
    ```javascript
    socket.on('recieveMessage', (newMessage) => {})
    ```

  2. **previousMessages**(listener): This socket is used to receive previous messages (any previous chat which is present between user1 and user2) from the server.
    ```javascript
    socket.on('previousMessages', (previousMessages) => {})
    ```

  3. **sendMessages**(emitter): This socket is used to send messages to the server. It requires 2 arguments:
    - conversationId: unique ID present between 2 users.
    - message: Message which we need to send to the other user
    ```javascript
    socketRef.current.emit('sendMessages', { conversationId, message: newMessage });
    ```

  4. **joinRoom**(emitter): This socket is used to join a room in order to send real-time messages to the other user who is also present in the room through the Socket.io server. It takes 2 arguments:
    - userId: userId of the user who wants to join the room.
    - conversationId: unique ID present between 2 users.
    ```javascript
    socketRef.current.emit('joinRoom', { userId: props.user, conversationId: response.data.conversationId });
    ```

- **Backend**: There are 4 types of socket listeners and emitters which are used in our backend. Let's see them one by one.

  1. **connection**(listener): This socket is used to handle the connection event when a client connects to the Socket.io server. It stores the connected user's information (userId and socketId) in the `ConnectedSockets` array.
    ```javascript
    io.on('connection', (socket) => {
      const Userid = socket.handshake.auth.userid;
      ConnectedSockets.push({
        socketId: socket.id,
        Userid
      });
      console.log(`${Userid} got connected..`);
      // ...
    });
    ```

  2. **joinRoom**(listener): This socket is used to handle the event when a user joins a room. It joins the user to the specified room (conversationId) and emits the previous messages of that conversation to the user.
    ```javascript
    socket.on('joinRoom', async ({ userId, conversationId }) => {
      console.log(`User ${userId} trying to join the room ${conversationId}`);
      socket.join(conversationId);
      const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
      const chat = await Conversation.findOne({ _id: conversationObjectId });
      if (chat) {
        socket.emit('previousMessages', chat.messages);
      }
    });
    ```

  3. **sendMessages**(listener): This socket is used to handle the event when a user sends a message. It emits the received message to all users in the specified room (conversationId) and saves the message to the conversation in the database.
    ```javascript
    socket.on('sendMessages', async ({ conversationId, message }) => {
      console.log(`${conversationId} is trying to send ${message}`);
      io.to(conversationId).emit('recieveMessage', message);
      const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
      const chat = await Conversation.findOne({ _id: conversationObjectId });
      if (chat) {
        chat.messages.push(message);
        await chat.save();
      } else {
        console.log("Error in sending messages Chat not found!");
      }
    });
    ```

  4. **disconnect**(listener): This socket is used to handle the disconnection event when a user disconnects from the Socket.io server. It removes the disconnected user's information from the `ConnectedSockets` array.
    ```javascript
    socket.on('disconnect', () => {
      ConnectedSockets = ConnectedSockets.filter((soc) => soc.Userid !== Userid);
      console.log(socket.id + " disconnected");
    });
    ```

These are the socket listeners and emitters used in the backend and frontend to handle real-time messaging functionality in the dating app.

## Routes (frontend):
There routes are present so that frontend can fetch the appropriate data required for communication between 2 users :

1. **getconvoId (post)** : This route is used in order to get the conversation id from the backend between the 2 users. It takes 2 parameters:

   - userId1 : unique username of the sender
   - userId2 : unique username of the reciever

   **Response** : It is going to respond with a unique conversationid(string) between the 2 users.
   ```json
   {
    "conversationId": "6669a7f3d60161f5e3d21yu2"
   }
   ```
   **Request** :
   ```
   const response = await axios.post('http://localhost:3000/api/socketChat/chats/getconvoId', {
        userId1: props.user,
        userId2: user
   });
   ```
  


## Working of the application:

![UML diagram for realtimeSocketCHat](https://github.com/neerajk24/HoneyCup/assets/121400894/7cb79d84-872a-45a3-bb51-62396c49a6df)
