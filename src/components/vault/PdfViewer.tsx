"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="overflow-auto rounded-brand-md border border-gold/20 bg-navy-deep p-4">
      <Document file={fileUrl} onLoadSuccess={({ numPages: n }) => setNumPages(n)} loading={<p className="text-cream/70">Loading PDF…</p>}>
        {Array.from({ length: numPages }, (_, i) => (
          <Page key={i + 1} pageNumber={i + 1} width={640} className="mb-4" />
        ))}
      </Document>
    </div>
  );
}
