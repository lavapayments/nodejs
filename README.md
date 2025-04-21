# @lavapayments/nodejs

Backend SDK for Lava Payments API - enabling usage-based billing for AI services.

## Installation

```bash
npm install @lavapayments/nodejs
```

## Usage

### Initialize the client

```typescript
import { Lava } from '@lavapayments/nodejs';

const lava = new Lava('your_secret_key', {
  apiVersion: '2025-04-21.v1',
});
```

### Create a checkout session

```typescript
const checkoutSession = await lava.checkout.create({
  checkout_mode: 'onboarding', // or 'topup' for existing connections
  origin_url: 'https://your-app.com/', // Must match window.location.origin where checkout will be opened
  reference_id: 'user_123', // Optional: your user ID for tracking this connection
});

// Use checkout_session_token with @lavapayments/checkout on frontend
console.log(checkoutSession.checkout_session_token);
```

### Make a request to an AI provider

```typescript
// Generate a forward token
const forwardToken = lava.generateForwardToken({
  connection_secret: 'connection_secret',
  product_secret: 'product_secret',
});

// Use the token to make an API request through Lava
const response = await fetch(lava.openaiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${forwardToken}`
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Hello, world!' }
    ]
  })
});

// Get the Lava request ID from the response header
const requestId = response.headers.get('x-lava-request-id');
console.log('Lava request ID:', requestId);

const data = await response.json();
console.log(data);
```

### Check a connection's balance

```typescript
const connection = await lava.connections.retrieve('connection_id');
console.log('Current balance:', connection.wallet.balance);
```

### Get connection requests

```typescript
const requests = await lava.requests.list({
  connection_id: 'connection_id',
  limit: 10,
});

console.log(requests.data);
```

### Get usage statistics

```typescript
const usage = await lava.usage.retrieve({
  connection_id: 'connection_id',
  start: '2024-01-01T00:00:00Z',
  end: '2024-01-31T23:59:59Z',
});

console.log(usage);
```

## Supported AI Providers

Convenience URLs are provided for the following AI providers:

- OpenAI: `lava.openaiUrl`
- Anthropic: `lava.anthropicUrl`
- Mistral: `lava.mistralUrl`
- DeepSeek: `lava.deepseekUrl`
- xAI: `lava.xaiUrl`
- Google: `lava.googleUrl`

For other providers, you can use the forward endpoint directly:

```typescript
const url = `${lava.baseUrl}forward?u=https://api.yourprovider.com/endpoint`;
```

## Related Documentation

For complete documentation on Lava's usage-based billing system and backend integration, visit [lavapayments.com](https://www.lavapayments.com).