# PropertyAgent

PropertyAgent is a minimal chat assistant for multifamily maintenance technicians. A SwiftUI iOS client talks to a tiny Node.js backend that uses OpenAI to answer questions and gradually learn property facts with a SQLite database.

## Architecture

```
iOS app (SwiftUI) → Express/TypeScript server → OpenAI APIs
                                 ↘ SQLite (facts store)
```

The server handles chat requests, embeds and searches property facts, and stores new facts extracted from conversations.

## Setup

Prerequisites: Node 18+, Xcode 15+

```bash
cd server
cp .env.example .env     # add your OpenAI key
npm install
npm run dev              # starts Express on PORT (default 3000)
```

Open `ios/PropertyAgent/PropertyAgent.xcodeproj` in Xcode, set the backend `baseURL` in `APIClient` if needed, and run on an iOS 17+ device or simulator.

## Endpoints

```bash
# health check
curl http://localhost:3000/health

# send chat message
curl -X POST http://localhost:3000/chat \
  -H 'Content-Type: application/json' \
  -d '{"thread_id":"t1","text":"AC not cooling in 3A","tech_id":"tech123","property_id":"propA"}'

# search facts
curl "http://localhost:3000/facts/search?property_id=propA&q=air+handler"
```

## Limitations

No authentication, no streaming, naive cosine similarity over all facts, and only a basic action pill in the iOS app. Future work includes streaming, auth, and better vector indexing.
