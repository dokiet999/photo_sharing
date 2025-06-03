import React, { useState } from "react";
function Comment({ photoId, user, onCommentAdded }) {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      setError("Bình luận không được để trống.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // Gửi cookie/session nếu bạn dùng session login
        body: JSON.stringify({ comment: commentText,user_id: user}),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gửi bình luận");
      }

      const result = await response.json();
      setCommentText(""); // Reset ô nhập
      setError("");
      onCommentAdded?.(result); // Gọi callback để refresh bình luận
    } catch (err) {
      setError("Không thể gửi bình luận.");
    }
    console.log("Comment submitted:", commentText);
    console.log("Photo ID:", photoId);
    console.log("User ID:", user._id);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <textarea
        placeholder="Viết bình luận..."
        rows={3}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      {error && <div style={{ color: "red", marginTop: "4px" }}>{error}</div>}

      <button onClick={handleSubmit} style={{ marginTop: "8px" }}>
        Gửi bình luận
      </button>
    </div>
  );
}

export default Comment;