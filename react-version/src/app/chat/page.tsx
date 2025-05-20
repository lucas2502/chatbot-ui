"use client";

import { useState, useRef } from "react";
import {
  Container,
  TextInput,
  Button,
  ScrollArea,
  Text,
  Group,
  Loader,
  Paper,
} from "@mantine/core";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  typing?: boolean;
}

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 100);
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        sender: "bot",
        text: "",
        timestamp: new Date(),
        typing: true,
      },
    ]);
    setQuestion("");
    scrollToBottom();

    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const reply = data?.resposta || "Erro na resposta da API";

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: "Erro ao chamar a API.",
          timestamp: new Date(),
        },
      ]);
    }

    scrollToBottom();
  };

  return (
    <Container size="md" px="md" py="lg">
      <Group
        flex="true"
        justify="space-between"
        // style={{ display: "flex", "justify-content": "space-between" }}
        mb="lg"
      >
        <Text fw={700} size="lg">
          💬 Assistente Técnico
        </Text>
        <Button
          variant="light"
          color="blue"
          onClick={() => (window.location.href = "/documentation")}
        >
          📄 Gerador de Documentação
        </Button>
      </Group>

      <ScrollArea h={500} ref={scrollAreaRef} type="auto" mb="md" flex="true">
        {messages.map((msg, i) => (
          <Group
            key={i}
            justify={msg.sender === "user" ? "right" : "left"}
            mb="xs"
          >
            <Paper
              shadow="sm"
              p="sm"
              radius="md"
              withBorder
              style={{
                backgroundColor: msg.sender === "user" ? "#228be6" : "#1c1f26",
                color: "#fff",
                maxWidth: "80%",
              }}
            >
              {msg.typing ? <Loader size="xs" color="gray" /> : msg.text}
              <Text size="xs" mt="xs" c="#ff" opacity={0.85}>
                {formatTime(msg.timestamp)}
              </Text>
            </Paper>
          </Group>
        ))}
      </ScrollArea>

      <Group>
        <TextInput
          placeholder="Digite sua pergunta..."
          value={question}
          onChange={(e) => setQuestion(e.currentTarget.value)}
          onKeyUp={(e) => e.key === "Enter" && sendMessage()}
          style={{ flexGrow: 1 }}
        />
        <Button onClick={sendMessage}>Enviar</Button>
      </Group>
    </Container>
  );
}
