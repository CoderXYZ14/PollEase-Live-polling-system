import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Types
interface Poll {
  id: string;
  question: string;
  options: string[];
  correctAnswers: number[]; // Array of correct option indices
  timeLimit: number;
  createdAt: Date;
  isActive: boolean;
  hasAnswered?: boolean;
}

interface PollResults {
  poll: Poll;
  results: Array<{
    option: string;
    count: number;
    percentage: number;
    isCorrect?: boolean; // Add this to indicate correct answers
  }>;
  totalResponses: number;
}

interface PastPoll extends Poll {
  results: PollResults;
  endedAt: Date;
}

interface StudentData {
  id: string;
  name: string;
  isTeacher: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isTeacher: boolean;
}

// In-memory storage (replace with MongoDB in production)
let currentPoll: Poll | null = null;
let students = new Map<string, StudentData>(); // studentId -> studentData
let responses = new Map<string, Map<string, any>>(); // pollId -> Map(studentId -> response)
let pastPolls: PastPoll[] = []; // Array of completed polls with results
let chatMessages: ChatMessage[] = []; // Array of chat messages
let pollTimer: NodeJS.Timeout | null = null; // Store timer reference

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Student joins
  socket.on("student-join", (studentName: string) => {
    const studentData: StudentData = {
      id: socket.id,
      name: studentName,
      isTeacher: false,
    };
    students.set(socket.id, studentData);
    socket.emit("student-joined", studentData);

    // Send current poll if exists
    if (currentPoll) {
      const hasAnswered = responses.get(currentPoll.id)?.has(socket.id);
      socket.emit("current-poll", { ...currentPoll, hasAnswered });

      // Send current time remaining if poll is active
      if (currentPoll.isActive) {
        const elapsed = Math.floor(
          (Date.now() - new Date(currentPoll.createdAt).getTime()) / 1000
        );
        const remaining = Math.max(0, currentPoll.timeLimit - elapsed);
        console.log(
          `Sending time-update to joining student: ${remaining}s remaining`
        );
        socket.emit("time-update", remaining);
      }
    }

    // Send chat messages
    socket.emit("chat-messages", chatMessages);

    // Update everyone with student count
    const studentCount = Array.from(students.values()).filter(
      (s) => !s.isTeacher
    ).length;
    io.emit("students-count", studentCount);

    // Send updated students list to all teachers
    const studentsList = Array.from(students.values()).filter(
      (s) => !s.isTeacher
    );
    io.emit("students-list", studentsList);

    console.log(
      `Student ${studentName} joined. Total students: ${studentCount}`
    );
  });

  // Teacher joins
  socket.on("teacher-join", () => {
    console.log("=== TEACHER JOIN EVENT ===");
    console.log("Teacher socket ID:", socket.id);

    const teacherData: StudentData = {
      id: socket.id,
      name: "Teacher",
      isTeacher: true,
    };

    // Add teacher to students map
    students.set(socket.id, teacherData);
    console.log("Teacher added to students map:", teacherData);

    socket.emit("teacher-joined", teacherData);

    // Send current poll and results if exists
    if (currentPoll) {
      const pollResponses = responses.get(currentPoll.id) || new Map();
      const results = calculateResults(currentPoll, pollResponses);
      socket.emit("current-poll", currentPoll);
      socket.emit("poll-results", results);
    }

    // Send past polls
    socket.emit("past-polls", pastPolls);

    // Send chat messages
    socket.emit("chat-messages", chatMessages);

    const studentCount = Array.from(students.values()).filter(
      (s) => !s.isTeacher
    ).length;
    socket.emit("students-count", studentCount);

    // Send students list to teacher
    const studentsList = Array.from(students.values()).filter(
      (s) => !s.isTeacher
    );
    socket.emit("students-list", studentsList);

    console.log("Teacher joined the session");
  });

  // Create new poll (teacher only)
  socket.on(
    "create-poll",
    (pollData: {
      question: string;
      options: string[];
      correctAnswers: number[];
      timeLimit?: number;
    }) => {
      if (!canCreateNewPoll()) {
        socket.emit(
          "error",
          "Cannot create poll: Previous poll is still active"
        );
        return;
      }

      // Clear any existing timer
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }

      currentPoll = {
        id: Date.now().toString(),
        question: pollData.question,
        options: pollData.options,
        correctAnswers: pollData.correctAnswers || [],
        timeLimit: pollData.timeLimit || 60,
        createdAt: new Date(),
        isActive: true,
      };

      responses.set(currentPoll.id, new Map());

      const studentCount = Array.from(students.values()).filter(
        (s) => !s.isTeacher
      ).length;
      console.log(
        `New poll created: "${currentPoll.question}" with ${currentPoll.options.length} options, ${currentPoll.timeLimit}s limit. Students: ${studentCount}`
      );

      // Notify all clients about new poll
      console.log("Sending new-poll event to all clients");
      io.emit("new-poll", currentPoll);

      // Send initial results to teacher
      const initialResults = calculateResults(currentPoll, new Map());
      console.log("Sending initial poll-results to all clients");
      io.emit("poll-results", initialResults);

      // Send initial time update
      console.log(
        `Sending initial time-update: ${currentPoll.timeLimit} seconds`
      );
      io.emit("time-update", currentPoll.timeLimit);

      // Start poll timer
      const pollId = currentPoll.id;
      const startTime = Date.now();

      console.log(`Starting poll timer for ${currentPoll.timeLimit} seconds`);

      // Send time updates every second
      const timeUpdateInterval = setInterval(() => {
        if (currentPoll && currentPoll.id === pollId && currentPoll.isActive) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const remaining = Math.max(0, currentPoll.timeLimit - elapsed);
          console.log(
            `Time update: ${remaining}s remaining (elapsed: ${elapsed}s)`
          );
          io.emit("time-update", remaining);

          if (remaining <= 0) {
            console.log("Time reached 0, clearing interval");
            clearInterval(timeUpdateInterval);
          }
        } else {
          console.log("Poll condition failed, clearing interval");
          console.log("currentPoll exists:", !!currentPoll);
          console.log("ID matches:", currentPoll?.id === pollId);
          console.log("Poll active:", currentPoll?.isActive);
          clearInterval(timeUpdateInterval);
        }
      }, 1000);

      pollTimer = setTimeout(() => {
        console.log("=== POLL TIMER CALLBACK TRIGGERED ===");
        clearInterval(timeUpdateInterval);
        if (currentPoll && currentPoll.id === pollId && currentPoll.isActive) {
          console.log("Timer conditions met, ending poll normally");
          endPoll();
        } else {
          console.log("Timer conditions not met:");
          console.log("currentPoll exists:", !!currentPoll);
          console.log("ID matches:", currentPoll?.id === pollId);
          console.log("Poll active:", currentPoll?.isActive);
        }
      }, currentPoll.timeLimit * 1000);

      console.log(`Poll timer set for ${currentPoll.timeLimit * 1000}ms`);
    }
  );

  // Submit answer (student only)
  socket.on("submit-answer", (data: { optionIndex: number }) => {
    if (!currentPoll || !currentPoll.isActive) {
      socket.emit("error", "No active poll");
      return;
    }

    const student = students.get(socket.id);
    if (!student) {
      socket.emit("error", "Student not found");
      return;
    }

    const pollResponses = responses.get(currentPoll.id);
    if (pollResponses?.has(socket.id)) {
      socket.emit("error", "Already answered this poll");
      return;
    }

    // Store response
    if (pollResponses) {
      pollResponses.set(socket.id, {
        optionIndex: data.optionIndex,
        submittedAt: new Date(),
      });

      console.log(
        `${student.name} answered option ${data.optionIndex}. Responses: ${pollResponses.size}/${students.size}`
      );
    }

    // Send answer confirmation with correctness
    const isCorrect = currentPoll.correctAnswers.includes(data.optionIndex);
    socket.emit("answer-submitted", {
      isCorrect,
      selectedOption: data.optionIndex,
      correctAnswers: currentPoll.correctAnswers,
    });

    // Send updated results to all users
    const results = calculateResults(currentPoll, pollResponses || new Map());
    io.emit("poll-results", results);

    // DO NOT END POLL WHEN STUDENTS ANSWER
    // Poll should only end when timer expires
    console.log(
      `Student answered. Poll continues. ${
        pollResponses?.size || 0
      } total responses so far`
    );
  });

  // Chat functionality
  socket.on("send-message", (messageData: { message: string }) => {
    const user = students.get(socket.id) || {
      name: "Teacher",
      isTeacher: true,
    };

    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user.name,
      message: messageData.message,
      timestamp: new Date(),
      isTeacher: user.isTeacher,
    };

    chatMessages.push(chatMessage);

    // Keep only last 100 messages
    if (chatMessages.length > 100) {
      chatMessages = chatMessages.slice(-100);
    }

    io.emit("new-message", chatMessage);
  });

  // Kick student (teacher only)
  socket.on("kick-student", (studentId: string) => {
    console.log("=== KICK STUDENT EVENT RECEIVED ===");
    console.log("Socket ID:", socket.id);
    console.log("Student ID to kick:", studentId);

    const studentToKick = students.get(studentId);
    if (studentToKick) {
      console.log("Found student to kick:", studentToKick.name);

      // Remove student from students map
      students.delete(studentId);
      console.log("Student removed from students map");

      // Remove student's vote from current poll if exists
      if (currentPoll) {
        const pollResponses = responses.get(currentPoll.id);
        if (pollResponses?.has(studentId)) {
          pollResponses.delete(studentId);
          console.log(`Removed vote from kicked student ${studentToKick.name}`);

          // Send updated results to all users
          const results = calculateResults(currentPoll, pollResponses);
          io.emit("poll-results", results);
          console.log("Updated poll results sent to all clients");
        }
      }

      // Notify the kicked student
      io.to(studentId).emit("kicked", "You have been kicked by the teacher");
      console.log("Kicked notification sent to student");

      // Update student count (exclude teachers)
      const studentCount = Array.from(students.values()).filter(
        (s) => !s.isTeacher
      ).length;
      io.emit("students-count", studentCount);
      console.log("Updated student count sent:", studentCount);

      // Send updated students list to all teachers
      const studentsList = Array.from(students.values()).filter(
        (s) => !s.isTeacher
      );
      io.emit("students-list", studentsList);
      console.log("Updated students list sent to teachers");

      console.log(`Student ${studentToKick.name} was kicked successfully`);
    } else {
      console.log("Error: Student to kick not found:", studentId);
    }
  });

  // Get past polls
  socket.on("get-past-polls", () => {
    socket.emit("past-polls", pastPolls);
  });

  socket.on("disconnect", () => {
    const student = students.get(socket.id);
    if (student) {
      console.log(
        `${student.isTeacher ? "Teacher" : student.name} disconnected`
      );
    }
    students.delete(socket.id);

    // Send updated student count (exclude teachers)
    const studentCount = Array.from(students.values()).filter(
      (s) => !s.isTeacher
    ).length;
    io.emit("students-count", studentCount);

    // Send updated students list to all teachers (only if a student disconnected)
    if (student && !student.isTeacher) {
      const studentsList = Array.from(students.values()).filter(
        (s) => !s.isTeacher
      );
      io.emit("students-list", studentsList);
    }

    // Don't end poll when students disconnect - let timer handle it
  });
});

function canCreateNewPoll(): boolean {
  if (!currentPoll) return true;

  // Can only create new poll if current poll is not active (ended by timer)
  return !currentPoll.isActive;
}

function endPoll(): void {
  if (!currentPoll) {
    console.log("endPoll() called but no current poll exists");
    return;
  }

  console.log("=== ENDING POLL ===");
  console.log("Poll question:", currentPoll.question);
  console.log("Poll was active:", currentPoll.isActive);
  console.log("Poll ID:", currentPoll.id);
  console.log("===================");

  // Clear timer
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
    console.log("Cleared poll timer");
  }

  currentPoll.isActive = false;

  // Send final time update
  console.log("Sending final time-update: 0");
  io.emit("time-update", 0);

  const pollResponses = responses.get(currentPoll.id);
  const results = calculateResults(currentPoll, pollResponses || new Map());

  // Store in past polls
  pastPolls.push({
    ...currentPoll,
    results,
    endedAt: new Date(),
  });

  // Keep only last 50 polls
  if (pastPolls.length > 50) {
    pastPolls = pastPolls.slice(-50);
  }

  console.log("Sending poll-ended event");
  io.emit("poll-ended", results);

  console.log(
    `Poll ended. Final results: ${results.totalResponses} responses from ${students.size} students`
  );
}

function calculateResults(
  poll: Poll,
  pollResponses: Map<string, any>
): PollResults {
  const results = poll.options.map((option, index) => {
    const count = Array.from(pollResponses.values()).filter(
      (response) => response.optionIndex === index
    ).length;
    const percentage =
      pollResponses.size > 0
        ? Math.round((count / pollResponses.size) * 100)
        : 0;

    return {
      option,
      count,
      percentage,
      isCorrect: poll.correctAnswers.includes(index), // Mark if this option is correct
    };
  });

  return {
    poll,
    results,
    totalResponses: pollResponses.size,
  };
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});

export { io, app };
