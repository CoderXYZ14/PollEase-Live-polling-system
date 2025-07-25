import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export interface Poll {
  id: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  timeLimit: number;
  createdAt: Date;
  isActive: boolean;
  hasAnswered?: boolean;
}

export interface PollResults {
  poll: Poll;
  results: Array<{
    option: string;
    count: number;
    percentage: number;
    isCorrect?: boolean;
  }>;
  totalResponses: number;
}

export interface PastPoll extends Poll {
  results: PollResults;
  endedAt: Date;
}

export interface StudentData {
  id: string;
  name: string;
  isTeacher: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isTeacher: boolean;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
};

export const useTeacher = () => {
  const { socket, isConnected } = useSocket();
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [studentsCount, setStudentsCount] = useState(0);
  const [studentsList, setStudentsList] = useState<StudentData[]>([]);
  const [pastPolls, setPastPolls] = useState<PastPoll[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Join as teacher
    socket.emit("teacher-join");

    // Listen for events
    socket.on("teacher-joined", (teacherData: StudentData) => {
      console.log("Joined as teacher:", teacherData);
    });

    socket.on("current-poll", (poll: Poll) => {
      setCurrentPoll(poll);
    });

    socket.on("new-poll", (poll: Poll) => {
      console.log("Teacher received new poll:", poll.question);
      setCurrentPoll(poll);
      setPollResults(null); // Clear previous results
    });

    socket.on("poll-results", (results: PollResults) => {
      setPollResults(results);
    });

    socket.on("students-count", (count: number) => {
      setStudentsCount(count);
    });

    socket.on("students-list", (students: StudentData[]) => {
      console.log("Teacher received students-list:", students);
      setStudentsList(students);
    });

    socket.on("poll-ended", (results: PollResults) => {
      setPollResults(results);
      setCurrentPoll((prev) => (prev ? { ...prev, isActive: false } : null));
    });

    socket.on("past-polls", (polls: PastPoll[]) => {
      setPastPolls(polls);
    });

    socket.on("chat-messages", (messages: ChatMessage[]) => {
      setChatMessages(messages);
    });

    socket.on("new-message", (message: ChatMessage) => {
      setChatMessages((prev) => [...prev, message]);
    });

    socket.on("error", (errorMessage: string) => {
      setError(errorMessage);
    });

    return () => {
      socket.off("teacher-joined");
      socket.off("current-poll");
      socket.off("poll-results");
      socket.off("students-count");
      socket.off("students-list");
      socket.off("poll-ended");
      socket.off("past-polls");
      socket.off("chat-messages");
      socket.off("new-message");
      socket.off("error");
    };
  }, [socket]);

  const createPoll = (
    question: string,
    options: string[],
    correctAnswers: number[],
    timeLimit = 60
  ) => {
    if (!socket) return;

    setError(null);
    socket.emit("create-poll", {
      question,
      options,
      correctAnswers,
      timeLimit,
    });
  };

  const sendMessage = (message: string) => {
    if (!socket) return;
    socket.emit("send-message", { message });
  };

  const kickStudent = (studentId: string) => {
    if (!socket) return;

    console.log("kickStudent called with studentId:", studentId);
    socket.emit("kick-student", studentId);
    console.log("kick-student event sent");
  };

  const getPastPolls = () => {
    if (!socket) return;
    socket.emit("get-past-polls");
  };

  return {
    isConnected,
    currentPoll,
    pollResults,
    studentsCount,
    studentsList,
    pastPolls,
    chatMessages,
    error,
    createPoll,
    sendMessage,
    kickStudent,
    getPastPolls,
    clearError: () => setError(null),
  };
};

export const useStudent = (studentName: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    selectedOption: number;
    correctAnswers: number[];
  } | null>(null);
  const [isKicked, setIsKicked] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      if (studentName) {
        newSocket.emit("student-join", studentName);
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("student-joined", (data: StudentData) => {
      console.log("Joined as student:", data);
    });

    newSocket.on("current-poll", (poll: Poll) => {
      setCurrentPoll(poll);
      setHasAnswered(false);
      setAnswerResult(null); // Reset answer result for new poll
    });

    newSocket.on("new-poll", (poll: Poll) => {
      console.log("Received new poll:", poll.question);
      setCurrentPoll(poll);
      setHasAnswered(false);
      setAnswerResult(null); // Reset answer result for new poll
      setPollResults(null); // Clear previous results
    });

    newSocket.on("poll-results", (results: PollResults) => {
      setPollResults(results);
    });

    newSocket.on("poll-ended", (results: PollResults) => {
      setPollResults(results);
      setCurrentPoll((prev) => (prev ? { ...prev, isActive: false } : null));
      setTimeRemaining(0);
    });

    newSocket.on("time-update", (time: number) => {
      setTimeRemaining(time);
    });

    newSocket.on(
      "answer-submitted",
      (data: {
        isCorrect: boolean;
        selectedOption: number;
        correctAnswers: number[];
      }) => {
        setHasAnswered(true);
        setAnswerResult(data);
      }
    );

    newSocket.on("kicked", () => {
      setIsKicked(true);
    });

    newSocket.on("chat-messages", (messages: ChatMessage[]) => {
      setChatMessages(messages);
    });

    newSocket.on("new-message", (message: ChatMessage) => {
      setChatMessages((prev) => [...prev, message]);
    });

    newSocket.on("error", (errorMessage: string) => {
      setError(errorMessage);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [studentName]);

  const submitAnswer = (optionIndex: number) => {
    if (!socket || !currentPoll || hasAnswered) return;

    setError(null);
    socket.emit("submit-answer", { optionIndex });
  };

  const sendMessage = (message: string) => {
    if (!socket) return;

    socket.emit("send-message", {
      message,
      sender: studentName,
      isTeacher: false,
    });
  };

  const clearError = () => setError(null);

  return {
    isConnected,
    currentPoll,
    pollResults,
    timeRemaining,
    hasAnswered,
    answerResult,
    isKicked,
    chatMessages,
    error,
    submitAnswer,
    sendMessage,
    clearError,
  };
};
