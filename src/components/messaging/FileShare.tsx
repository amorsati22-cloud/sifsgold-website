"use client";

import { useState } from "react";
import { MESSAGE_FILE_MAX_BYTES } from "@/lib/messaging/constants";
import { encryptJson, encryptMessage } from "@/lib/messaging/encryption";

type Props = {
  threadId: string;
  threadKey: Uint8Array;
  onSent: () => void;
};

export function FileShare({ threadId, threadKey, onSent }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function uploadAll() {
    setError(null);
    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      if (file.size > MESSAGE_FILE_MAX_BYTES) {
        setError(`${file.name} exceeds 10MB limit`);
        return;
      }
      setProgress(Math.round((i / files.length) * 100));
      const buf = new Uint8Array(await file.arrayBuffer());
      const b64 = btoa(String.fromCharCode(...buf));
      const enc = encryptMessage(b64, threadKey);
      const metaEnc = encryptJson(
        { name: file.name, size: file.size, mime_type: file.type || "application/octet-stream" },
        threadKey,
      );
      const preview = encryptMessage(`File: ${file.name}`, threadKey);

      const res = await fetch("/api/messages/file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          encrypted_body: enc.ciphertext,
          iv: enc.iv,
          file_metadata: { name: file.name, size: file.size, mime_type: file.type },
          encrypted_attachments: metaEnc.ciphertext,
          attachments_iv: metaEnc.iv,
          encrypted_preview: preview.ciphertext,
          preview_iv: preview.iv,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError((data as { error?: string }).error ?? "Upload failed");
        return;
      }
    }
    setProgress(100);
    setFiles([]);
    onSent();
  }

  return (
    <div className="rounded-brand-md border border-gold/20 bg-navy/40 p-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFiles(Array.from(e.dataTransfer.files));
        }}
        className="rounded-brand-sm border border-dashed border-gold/30 p-4 text-center"
      >
        <p className="font-body text-xs text-cream/75">Drop files (max 10MB each, 100MB/thread/day)</p>
        <label className="mt-2 inline-block cursor-pointer font-body text-sm text-gold underline">
          Browse
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </label>
      </div>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1 font-body text-xs text-cream">
          {files.map((f) => (
            <li key={f.name}>
              {f.name} ({(f.size / 1024).toFixed(0)} KB)
              {f.type.startsWith("image/") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={URL.createObjectURL(f)} alt="" className="mt-1 max-h-24 rounded" />
              )}
            </li>
          ))}
        </ul>
      )}
      {progress > 0 && progress < 100 && (
        <motion.div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-deep">
          <motion.div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </motion.div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {files.length > 0 && (
        <button
          type="button"
          onClick={() => void uploadAll()}
          className="mt-3 w-full rounded-brand-md bg-gold py-2 font-body text-sm font-medium text-navy"
        >
          Send {files.length} file(s)
        </button>
      )}
    </motion.div>
  );
}
