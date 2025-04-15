import React, { useEffect, useState } from "react";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://10.2.1.133:3000/api/files")
      .then((response) => response.json())
      .then((data) => setFiles(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleDownload = (filename) => {
    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = `http://10.2.1.133:3000/api/download/${filename}`;
    link.download = filename; // Optional: specify filename for download
    link.click();
  };

  return (
    <div>
      <h1>File List</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {files.length > 0 ? (
          files.map((file, index) => (
            <li key={index}>
              {file}
              <button onClick={() => handleDownload(file)}>Download</button>
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
