# Message Format Specification

## Overview

This specification defines the data model for messages in the 111 Network system. This format will be used across all repositories (website, protocol, mobile, etc.) to ensure consistency.

## Requirements

### Daily Public Broadcast Message

Each user can post one public broadcast message per day that will be pinned on a world map.

### Private Messages

Private messages support end-to-end encryption and can hop via nearby devices even without internet connectivity.

## Data Model

### Message Structure

```
Message {
  id: string (unique identifier)
  type: "public" | "private"
  content: string (message text)
  location: {
    latitude: number
    longitude: number
    accuracy?: number (optional, in meters)
  }
  timestamp: number (Unix timestamp)
  author: {
    identity: "anonymous" | "identified"
    identifier?: string (optional, if identified)
    publicKey?: string (optional, for encryption)
  }
  encryption?: {
    algorithm: string
    keyId: string
  }
  transport?: string[] (optional, transport methods used: "bluetooth", "wifi", "radio", "email", "satellite")
  metadata?: {
    hopCount?: number (for mesh routing)
    receivedVia?: string (transport method)
  }
}
```

## Identity Options

### Anonymous
- No personal identifier required
- Public key may be used for encryption
- Location data may be approximate

### Identified
- User provides identifier (username, email, etc.)
- Identity verification method TBD
- May enable additional features

## Location Data

- Required for public broadcast messages (for map pinning)
- Optional for private messages
- Can be approximate or exact based on user preference
- Privacy considerations: users may choose to use approximate location

## Encryption

- Private messages must support end-to-end encryption
- Encryption algorithm TBD (will be specified in protocol repository)
- Public broadcast messages are unencrypted by design

## Transport Layer

Messages can be transmitted via multiple transport methods:
- Bluetooth (device-to-device)
- Wi-Fi (local network)
- Radio (hardware boosters)
- Email (fallback)
- Satellite (future)

The transport layer is abstracted - the message format remains consistent regardless of transport method.

## Future Considerations

- Message size limits
- Media attachments (images, files)
- Message expiration/retention policies
- Message threading for conversations
- Message routing algorithms (for mesh network)

## Integration Notes

This specification will be implemented in:
- Protocol repository: Core message handling and routing
- Website repository: Message display and visualization
- Mobile repository: Message creation and transmission
- Hardware repository: Low-level transport implementation
