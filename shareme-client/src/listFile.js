import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";

const FileList = ({ message, ip }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const listFiles = useCallback(async () => {
    try {
      const data = await fetch(`http://${ip}:3000/api/files`);
      const result = await data.json();
      setFiles(result);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [ip]);

  useEffect(() => {
    listFiles();
  }, [message, listFiles]);

  const handleDownload = (filename) => {
    const link = document.createElement("a");
    link.href = `http://${ip}:3000/api/download/${filename}`;
    link.download = filename;
    link.click();
  };

  const removeStore = async (filename) => {
    try {
      await fetch(`http://${ip}:3000/api/remove/${filename}`, {
        method: "DELETE",
      });
      listFiles();
    } catch (error) {
      setError(`Failed to delete ${filename}: ${error.message}`);
    }
  };

  return (
    <div className="listFileMain">
      <h2 className="section-title">📁 Download Center</h2>

      {loading && <ProgressSpinner style={{ width: "40px", height: "40px" }} />}

      {error && <Message severity="error" text={`Error: ${error}`} />}

      {!loading && files.length > 0 ? (
        <div className="file-list">
          {files.map((file, index) => (
            <Card key={index} className="file-card">
              <div className="file-info">
                <i
                  className="pi pi-file"
                  style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                ></i>
                <span className="file-name">{file}</span>
              </div>
              <Button
                icon="pi pi-download"
                className="p-button-sm p-button-primary"
                onClick={() => handleDownload(file)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-sm p-button-primary"
                onClick={() => removeStore(file)}
              />
            </Card>
          ))}
        </div>
      ) : (
        !loading && <p className="no-files">No files found.</p>
      )}
    </div>
  );
};

export default FileList;
