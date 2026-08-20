"use client";

import { useRef, useState } from "react";
import { streamAiChat } from "@/lib/ai/client";
import type { AiContext } from "@/lib/ai/types";
import { Icon } from "@/components/design/icon";

interface Message {
  role: "user" | "assistant";
  text: string;
  error?: boolean;
  image?: string;
}

async function fileToResizedDataUrl(file: File, maxSize = 1024): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("decode_failed"));
    image.src = dataUrl;
  });
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

interface MentorChatProps {
  mode: "tutor" | "mentor";
  context?: AiContext;
  placeholder?: string;
}

export function AiChat({ mode, context, placeholder }: MentorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const attachFile = async (file: File | undefined) => {
    if (!file || streaming) return;
    if (!file.type.startsWith("image/")) return;
    const resized = await fileToResizedDataUrl(file);
    setImage(resized);
  };

  const send = async () => {
    const question = input.trim();
    if ((!question && !image) || streaming) return;
    setInput("");
    const currentImage = image;
    setImage(null);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question || "(gambar dilampirkan)", image: currentImage ?? undefined },
    ]);
    setStreaming(true);

    let buffer = "";
    const assistantMessage: Message = { role: "assistant", text: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    const result = await streamAiChat(
      mode,
      question || "Apa isi dan masalah pada gambar ini? Jelaskan.",
      context,
      {
        image: currentImage ?? undefined,
        onToken: (token) => {
          buffer += token;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", text: buffer };
            return next;
          });
        },
      },
    );

    if (!result.ok && buffer === "") {
      const errorText =
        result.error === "quota_exceeded"
          ? "Kamu sudah mencapai batas AI harian. Coba lagi besok!"
          : result.error === "mentor_locked"
            ? "AI Mentor belum aktif. Mulai trial 1 minggu atau langganan."
            : "AI sedang tidak tersedia. Coba lagi sebentar."
      ;
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          text: errorText,
          error: true,
        };
        return next;
      });
    }
    setStreaming(false);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-slate-900/60">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {placeholder ?? "Tanya apa pun tentang coding..."}
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
              message.role === "user"
                ? "ml-auto bg-accent text-accent-foreground"
                : message.error
                  ? "border border-rose-500/40 bg-rose-500/10 text-rose-200"
                  : "bg-muted text-foreground"
            }`}
          >
            {message.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={message.image}
                alt="lampiran"
                className="mb-1 max-h-40 rounded-lg object-contain"
              />
            )}
            {message.text}
            {streaming && index === messages.length - 1 && (
              <span className="animate-pulse">▋</span>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        {image && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="lampiran"
              className="h-12 w-12 rounded object-cover"
            />
            <span className="flex-1 truncate text-xs text-muted-foreground">
              Gambar siap dilampirkan
            </span>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="text-xs text-muted-foreground hover:text-rose-300"
            >
              Batal
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void attachFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={streaming}
            title="Lampirkan gambar (contoh: screenshot error)"
            className="rounded-lg border border-border px-3 py-2 text-sm transition hover:bg-muted disabled:opacity-40"
          >
            <Icon name="camera" size={16} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Ketik pesan..."
            className="flex-1 rounded-lg border border-border bg-slate-950 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={streaming}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-110 disabled:opacity-50"
          >
            {streaming ? "..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}