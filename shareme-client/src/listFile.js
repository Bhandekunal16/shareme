import React, { useEffect, useState } from "react";
import "./App.css";
import { Button } from "primereact/button";

const FileList = ({ message }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://10.2.1.133:3000/api/files")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((err) => setError(err.message));
  }, [message]);

  const handleDownload = (filename) => {
    const link = document.createElement("a");
    link.href = `http://10.2.1.133:3000/api/download/${filename}`;
    link.download = filename;
    link.click();
  };

  return (
    <div className="listFileMain">
      <h1>File List</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {files.length > 0 ? (
          files.map((file, index) => (
            <li key={index}>
              <span>{file}</span>
              <Button onClick={() => handleDownload(file)}>Download</Button>
            </li>
          ))
        ) : (
          <p>No files found</p>
        )}
      </ul>
    </div>
  );
};

export default FileList;
