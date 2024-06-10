# New Idea for Chat Model

## Overview

This document outlines a new design for a chat application model, replacing the traditional message model with a conversation model. This approach ensures that each conversation between two users contains all messages exchanged between them. 

## Key Features

1. **Participants**: Each conversation is strictly between two users.
2. **Messages**: All messages within a conversation are stored as an array.
3. **Content Type**: Messages can be text or non-text (e.g., files). Non-text messages will have a `content_link` instead of `content`.
4. **Read/Unread Status**: Each message includes a field indicating whether it has been read by the receiver.

## Model Explanation

### Content Type Handling
- **Text Messages**: Directly stored in the `content` field.
- **Non-Text Messages**: The `content` field is set to `null`, and the `content_link` field stores the URL of the file.

### Read/Unread Status
- **Field**: `is_read`
- **Default Value**: `false`
- **Behavior**: Set to `true` when the receiver views the message.

### Participants
- **Participants Field**: Stores the IDs of the two users in the conversation.
- **Receiver ID in Messages**: Since the conversation involves only two users, the receiver ID can be inferred and does not need to be stored in each message.

## Model Example

```bash
{
  "_id": "unique_conversation_id",
  "participants": [
    "user_id_1",
    "user_id_2"
  ],
  "messages": [
    {
      "message_id": "unique_message_id_1",
      "sender_id": "user_id_1",
      "content": "Hello, how are you?",
      "content_type": "text",
      "content_link": null,
      "timestamp": "2024-05-18T12:34:56Z",
      "is_read": false
    },
    {
      "message_id": "unique_message_id_2",
      "sender_id": "user_id_2",
      "content": "I'm good, thanks!",
      "content_type": "text",
      "content_link": null,
      "timestamp": "2024-05-18T12:35:10Z",
      "is_read": false
    },
    {
      "message_id": "unique_message_id_3",
      "sender_id": "user_id_1",
      "content": null,
      "content_type": "file",
      "content_link": "https://kavoappstorage.blob.core.windows.net/azure-filearchive/test.jpg",
      "timestamp": "2024-05-18T12:36:00Z",
      "is_read": false
    }
  ]
}
