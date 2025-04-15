import React, { useState } from "react";
import "./App.css";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("No file selected");

    const formData = new FormData();
    formData.append("myFile", file);

    try {
      const response = await fetch("http://10.2.1.133:3000/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      setMessage(text);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <div
      style={{ padding: "2rem", fontFamily: "sans-serif" }}
      className="fileUploadMain"
    >
      <h2>Upload a File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <br />
        <br />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUploader;
