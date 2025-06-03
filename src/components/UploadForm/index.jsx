import React, { useState } from "react";

function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile); // Tên "photo" phải trùng với multer

    try {
      const response = await fetch("http://localhost:8081/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Upload thành công:", result);
    } catch (error) {
      console.error("Lỗi khi upload:", error);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
}

export default UploadForm;
