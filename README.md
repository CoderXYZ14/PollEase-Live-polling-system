# Live Polling System

A real-time live polling system built with Next.js, Socket.IO, and Express. Teachers can create polls and students can answer them in real-time with live results.

## Features

### Teacher Features

- ✅ Create new polls with custom questions and options
- ✅ Configure time limits for polls (30 seconds to 5 minutes)
- ✅ View live polling results in real-time
- ✅ See student count and connection status
- ✅ Cannot create new polls while one is active (waits for all students to answer or timer to expire)

### Student Features

- ✅ Enter name once per browser tab (stored in sessionStorage)
- ✅ Answer polls within the configured time limit
- ✅ View live results after submitting or when time expires
- ✅ Real-time connection status
- ✅ Automatic timeout handling (60 seconds max as per requirements)

### Technical Features

- ✅ Real-time communication via Socket.IO
- ✅ Session management per browser tab
- ✅ Automatic poll ending when all students answer or time expires
- ✅ Live result updates
- ✅ Error handling and connection status
- ✅ Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pollease-live-polling-system
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Run the development server:

```bash
# Run both server and frontend
bun run dev:all

# Or run them separately:
# Terminal 1 - Server
bun run server

# Terminal 2 - Frontend
bun run dev
```

4. Open your browser and navigate to:

- Frontend: http://localhost:3000
- Server: http://localhost:3001

## How to Use

### For Teachers:

1. Click "Join as Teacher"
2. Create polls by entering a question and multiple choice options
3. Set time limit (optional, defaults to 60 seconds)
4. Click "Ask Question" to start the poll
5. View live results as students respond
6. Wait for all students to answer or timer to expire before creating a new poll

### For Students:

1. Click "Join as Student"
2. Enter your name (unique per browser tab)
3. Wait for teacher to create a poll
4. Select your answer and submit within the time limit
5. View results after submitting or when time expires

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── teacher/
│   │   │   └── page.tsx      # Teacher dashboard
│   │   ├── student/
│   │   │   └── page.tsx      # Student interface
│   │   └── student-poll/
│   │       └── page.tsx      # Student poll UI (reference)
│   ├── components/           # Reusable components
│   └── lib/
│       ├── server.ts         # Socket.IO server
│       └── socket.ts         # Socket.io client hooks
├── package.json
└── README.md
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Socket.IO
- **Real-time**: WebSocket communication via Socket.IO
- **Styling**: Tailwind CSS for responsive design
- **Package Manager**: Bun (or npm)

## Development

The application uses:

- TypeScript for type safety
- Socket.io for real-time communication
- Tailwind CSS for styling
- Session storage for student name persistence

## Requirements Met

### Must Haves ✅

- ✅ System is functional
- ✅ Teacher can ask polls
- ✅ Students can answer them
- ✅ Both teacher and student can view poll results
- ✅ Full solution with website + backend

### Good to Have ✅

- ✅ Teacher can configure maximum time for a poll (30s to 5min)
- ✅ Website is designed properly with existing UI

### Brownie Points ✅

- ✅ Real-time communication
- ✅ Proper session management
- ✅ Error handling
- ✅ Connection status indicators

## API Endpoints

The server runs on port 3001 and provides Socket.IO events:

### Teacher Events

- `teacher-join` - Teacher joins the session
- `create-poll` - Create a new poll
- `kick-student` - Kick a student (teacher only)

### Student Events

- `student-join` - Student joins with name
- `submit-answer` - Submit poll answer

### Shared Events

- `send-message` - Send chat message
- `get-past-polls` - Get past poll results

## License

This project is licensed under the MIT License.
