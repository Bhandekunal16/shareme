import React, { useState, useEffect } from "react";
import FileUploader from "./fileuploader";
import FileList from "./listFile";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

function App() {
  const [ip, setIp] = useState(null);
  const [value, setValue] = useState(false);
  const handleData = (data) => {
    setValue(data);
  };
  useEffect(() => {
    getEffect();
  }, []);

  const getEffect = async () => {
    try {
      const res = await fetch("/config.json");
      const data = await res.json();
      setIp(data.ip);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <PrimeReactProvider>
      <FileUploader
        uploadFlag={(data) => handleData(data)}
        akg={value}
        ip={ip}
      />
      {ip && <FileList message={value} ip={ip} />}
    </PrimeReactProvider>
  );
}

export default App;
