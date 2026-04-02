"use client";

import React from "react";

const FEEDBACK_FORM_URL = "あなたのGoogleフォームのURL";

export default function FeedbackButton() {
  return (
    <a
      href={FEEDBACK_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#FF6B6B",
        color: "white",
        padding: "12px 24px",
        borderRadius: "30px",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        zIndex: 1000,
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "transform 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span>💬 バグ報告・感想はこちら</span>
    </a>
  );
}
