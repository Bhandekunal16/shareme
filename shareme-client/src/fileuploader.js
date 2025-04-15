import React, { useState, useEffect } from "react";
import "./App.css";
import { Button } from "primereact/button";
import { environment } from "./enviroment";

const FileUploader = ({ uploadFlag, akg }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (akg) {
      setMessage("File uploaded successfully");
      uploadFlag(false);
    }
  }, [akg, uploadFlag]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("No file selected");

    const formData = new FormData();
    formData.append("myFile", file);

    try {
      const response = await fetch(
        `http://${new environment().ip}:3000/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();
      setMessage(text);
      setFile(null);
      uploadFlag(true);
      console.log("File upload successful AAA");
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
      <h2>Upload & Share</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
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
