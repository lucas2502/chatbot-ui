"use client";

import { useState } from "react";
import {
  Container,
  Button,
  FileButton,
  Text,
  Textarea,
  Group,
} from "@mantine/core";

export default function DocGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState("");

  const generateDocumentation = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    setMarkdownPreview("");
    setDownloadLink("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:3000/documentation", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Falha na geração da documentação");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);

      const text = await blob.text();
      setMarkdownPreview(text);
    } catch (e) {
      setError("Erro ao gerar documentação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" px="md" py="xl">
      <Group flex="true" justify="space-between" mb="lg">
        <Text fw={700} size="lg">
          📄 Gerador de Documentação
        </Text>
        <Button
          variant="light"
          color="blue"
          onClick={() => (window.location.href = "/")}
        >
          💬 Chatbot
        </Button>
      </Group>

      <Group flex="true" justify="space-between">
        <FileButton onChange={setSelectedFile} accept="application/json">
          {(props) => (
            <Button {...props}>Selecionar arquivo Swagger (.json)</Button>
          )}
        </FileButton>

        {selectedFile && (
          <Text size="sm" mt="xs">
            Selecionado: {selectedFile.name}
          </Text>
        )}
      </Group>

      <Button
        mt="md"
        disabled={!selectedFile}
        loading={loading}
        onClick={generateDocumentation}
      >
        Gerar documentação
      </Button>

      {error && (
        <Text color="red" mt="md">
          {error}
        </Text>
      )}

      {markdownPreview && (
        <>
          <Text mt="xl" fw={700}>
            📄 Pré-visualização do Markdown
          </Text>
          <Textarea
            mt="sm"
            value={markdownPreview}
            minRows={10}
            autosize
            readOnly
          />
          <a href={downloadLink} download="documentacao.md">
            <Button mt="md" variant="outline">
              Baixar Markdown
            </Button>
          </a>
        </>
      )}
    </Container>
  );
}
