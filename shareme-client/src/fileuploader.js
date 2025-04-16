import React, { useState, useEffect } from "react";
import "./App.css";
import { Button } from "primereact/button";

const FileUploader = ({ uploadFlag, akg, ip }) => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (akg) {
      setMessage("Files uploaded successfully");
      uploadFlag(false);
    }
  }, [akg, uploadFlag]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return setMessage("No files selected");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("myFiles", file);
    });

    try {
      const response = await fetch(`http://${ip}:3000/upload`, {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      setMessage(text);
      setFiles([]);
      uploadFlag(true);
    } catch (err) {
      setMessage("Upload failed");
    }
  };

  return (
    <div
      style={{ padding: "2rem", fontFamily: "sans-serif" }}
      className="fileUploadMain"
    >
      <h2>Upload & Share</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
        />
        <br />
        <br />
        <Button type="submit" severity="success">
          Upload
        </Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUploader;
