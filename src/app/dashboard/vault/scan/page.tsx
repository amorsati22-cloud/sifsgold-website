"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useVault } from "@/components/vault/VaultProvider";
import { GoldButton } from "@/components/ui/GoldButton";
import { uploadEncryptedDocument } from "@/lib/vault/storage";
import { encryptMetadata } from "@/lib/vault/encryption";
import { createClient } from "@/lib/supabase/client";

export default function VaultScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cryptoKey, userId, unlocked } = useVault();
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch {
      setError("Camera access denied or unavailable.");
    }
  }

  async function captureAndSave() {
    if (!videoRef.current || !canvasRef.current || !cryptoKey || !userId) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) return;

    const docId = crypto.randomUUID();
    const path = `${userId}/${docId}.vault`;
    const uploaded = await uploadEncryptedDocument(userId, docId, blob, cryptoKey, "image/jpeg");
    if ("error" in uploaded) {
      setError(uploaded.error);
      return;
    }

    const meta = await encryptMetadata(cryptoKey, { notes: "Scanned document", tags: ["scan"] });
    const supabase = createClient();
    await supabase.from("vault_documents").insert({
      id: docId,
      user_id: userId,
      name: `Scan ${new Date().toLocaleDateString()}`,
      document_type: "other",
      file_url: path,
      mime_type: "image/jpeg",
      file_size_bytes: blob.size,
      encrypted_metadata: meta,
    });

    router.push(`/dashboard/vault/document/${docId}`);
  }

  return (
    <div>
      <h2 className="font-heading text-xl text-gold">Scan document</h2>
      <p className="mt-2 font-body text-sm text-cream/75">Use your camera to capture a document. Saved encrypted to your Vault.</p>

      {!streaming && <GoldButton label="Start camera" onClick={() => void startCamera()} variant="solid" className="mt-4" />}
      <video ref={videoRef} className="mt-4 max-h-[400px] w-full rounded-brand-md bg-black" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      {streaming && unlocked && (
        <GoldButton label="Capture & save" onClick={() => void captureAndSave()} variant="solid" className="mt-4" />
      )}
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
