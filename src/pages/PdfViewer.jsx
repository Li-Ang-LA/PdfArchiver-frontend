import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { downloadFileBlob } from "../api";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function PdfViewer({ token, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl;
    downloadFileBlob(token, id)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      })
      .catch((e) => setError(e.message));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token, id]);

  return (
    <div className="viewer-page">
      <header className="viewer-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← 返回
        </button>
        <div className="viewer-controls">
          {numPages && (
            <>
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
              >
                ‹
              </button>
              <span>
                {pageNumber} / {numPages}
              </span>
              <button
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
              >
                ›
              </button>
            </>
          )}
        </div>
        <button className="logout-btn" onClick={onLogout}>
          退出
        </button>
      </header>

      <main className="viewer-main">
        {error && <p className="error">{error}</p>}
        {fileUrl && (
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        )}
      </main>
    </div>
  );
}
