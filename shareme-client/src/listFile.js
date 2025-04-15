import React, { useEffect, useState } from "react";
import "./App.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";

const FileList = ({ message }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listFiles();
  }, [message]);

  const listFiles = () => {
    fetch("http://10.2.1.133:3000/api/files")
      .then((response) => response.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleDownload = (filename) => {
    const link = document.createElement("a");
    link.href = `http://10.2.1.133:3000/api/download/${filename}`;
    link.download = filename;
    link.click();
  };

  const removeStore = async (filename) => {
    await fetch(`http://10.2.1.133:3000/api/remove/${filename}`, {
      method: "DELETE",
    });
    listFiles();
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
