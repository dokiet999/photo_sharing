import React, { useState } from "react";

function UploadPhotoButton({ userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setSuccessMsg("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh.");
      return; 
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploading(true);
      const response = await fetch(`http://localhost:8081/upload/${userId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload thất bại");

      const result = await response.json();
      setSuccessMsg("Ảnh đã được upload thành công!");
      setFile(null);
      onUploadSuccess?.(result);
    } catch (err) {
      setError(err.message || "Lỗi upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Tải ảnh mới</h3>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {file && <p>Đã chọn: {file.name}</p>}

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Đang upload..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </div>
  );
}

export default UploadPhotoButton;
