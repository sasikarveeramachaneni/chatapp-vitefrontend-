<<<<<<< HEAD
# AI Chat Application

A full-stack web application for interactive AI-powered conversations with chat history management, topic extraction, and embedding-based search capabilities.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Real-time Chat Interface**: Interactive chat with AI responses
- **Chat History**: Persistent storage of conversations
- **Topic Extraction**: Automatic topic detection using LLM
- **Vector Embeddings**: Semantic search across chat messages
- **Chat Management**: Create, retrieve, and manage multiple chat sessions
- **Auto-generated Titles**: Automatic chat session titles based on first message

## Architecture

The application is built with a microservices architecture using Docker Compose:

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MySQL (relational data)
- **Graph Database**: Neo4j (chat relationships and topics)
- **Vector Storage**: Vector embeddings for semantic search
- **Authentication**: JWT-based auth with password hashing

### Frontend
- **Framework**: React 19
- **UI Components**: Custom CSS styling
- **API Client**: Axios for backend communication
- **State Management**: React hooks

### Services
```
├── backend/
│   ├── main.py              # FastAPI app initialization
│   ├── auth.py              # Authentication logic
│   ├── database.py          # MySQL connection
│   ├── neo4j_db.py          # Neo4j connection
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── routes/
│   │   ├── user.py          # Authentication endpoints
│   │   └── chat.py          # Chat endpoints
│   └── services/
│       ├── chat_service.py  # Chat session & message logic
│       ├── llm_service.py   # LLM response generation
│       ├── vector_service.py # Embedding & search
│       ├── topic_service.py # Topic extraction
│       └── title_service.py # Chat title generation
│
└── frontend/
    ├── public/              # Static assets
    └── src/
        ├── pages/
        │   ├── Auth.js      # Login/Register page
        │   ├── Chat.js      # Main chat interface
        │   └── ChatSidebar.js # Chat history sidebar
        └── services/
            └── api.js       # API client
```

## Prerequisites

- Docker & Docker Compose
- Python 3.8+ (if running locally)
- Node.js 14+ (if running locally)

## Setup & Installation

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-chat-docker
   ```

2. **Configure environment variables**
   
   Backend configuration in `backend/.env.docker`:
   ```env
   DATABASE_URL=mysql+mysqlconnector://root:password@mysql:3306/chatapp
   NEO4J_URI=bolt://neo4j:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=sai*1304
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ```

3. **Build and start containers**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - MySQL: localhost:3306
   - Neo4j Browser: http://localhost:7474

### Local Development Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Database Schema

### MySQL (User & Message Data)
- **users** table: User credentials and profile
- **chat_messages** table: Message history

### Neo4j (Graph Data)
- **User** nodes: User information
- **ChatSession** nodes: Chat sessions with metadata
- **Message** nodes: Individual messages
- **Topic** nodes: Extracted topics
- Relationships: `HAS_CHAT`, `CONTAINS_MESSAGE`, `LABELED_WITH`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Chat
- `POST /chat/create` - Create new chat session
- `POST /chat/{chat_id}/message` - Send message
- `GET /chat/{chat_id}/history` - Get chat history
- `GET /chat/sessions` - List user's chat sessions
- `DELETE /chat/{chat_id}` - Delete chat session

## Environment Variables

### Backend (.env.docker)
```
DATABASE_URL - MySQL connection string
NEO4J_URI - Neo4j connection URL
NEO4J_USER - Neo4j username
NEO4J_PASSWORD - Neo4j password
SECRET_KEY - JWT secret key
ALGORITHM - JWT algorithm (HS256)
```

### Frontend (.env)
```
REACT_APP_API_URL - Backend API base URL
```

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- Neo4j Python Driver
- python-jose (JWT)
- passlib (password hashing)
- httpx (HTTP client)
- email-validator

### Frontend
- React
- react-markdown (Markdown rendering)
- uuid (unique identifiers)
- CSS3

### Infrastructure
- Docker
- Docker Compose
- MySQL 8.0
- Neo4j 5.19
- Nginx (frontend reverse proxy)

## Project Structure

```
ai-chat-docker/
├── docker-compose.yml      # Service orchestration
├── README.md              # This file
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── neo4j_db.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   └── services/
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── public/
    └── src/
```

## Key Features Explained

### Chat Sessions
Users can create multiple chat sessions. Each session:
- Is uniquely identified by a UUID
- Stores creation timestamp
- Contains multiple messages
- Can have auto-generated titles
- Links to extracted topics

### Message Processing
When a message is sent:
1. Message is stored in MySQL
2. Neo4j graph is updated with relationships
3. LLM generates AI response
4. Embeddings are created for semantic search
5. Topics are extracted and linked
6. Chat title is auto-generated if first message

### Topic Extraction
- Automatic detection using LLM
- Topics are linked to messages
- Enables topic-based browsing and filtering

### Vector Search
- Message embeddings are stored
- Enables semantic similarity search
- Find similar messages across conversations

## Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `docker ps | grep mysql`
- Check credentials in `.env.docker`
- Verify database exists: `mysql -u root -p chatapp`

### Neo4j Connection Issues
- Ensure Neo4j is running: `docker ps | grep neo4j`
- Access Neo4j Browser at http://localhost:7474
- Verify credentials in `.env.docker`

### CORS Issues
- Backend CORS is configured for `localhost:3000`
- Modify `main.py` if running on different URL

### Container Won't Start
- Check logs: `docker compose logs -f`
- Rebuild containers: `docker compose down && docker compose up --build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please open an issue in the repository.

---

**Last Updated**: January 2026
=======
# ai-chat-docker
>>>>>>> 21c049f579e0fa49e008ee13fe1b24e809c11318
