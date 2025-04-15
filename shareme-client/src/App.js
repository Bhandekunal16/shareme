import React, { useState } from "react";
import FileUploader from "./fileuploader";
import FileList from "./listFile";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

function App() {
  const [value, setValue] = useState(false);
  const handleData = (data) => {
    setValue(data);
  };

  return (
    <PrimeReactProvider>
      <FileUploader uploadFlag={(data) => handleData(data)} akg={value}/>
      <FileList message={value} />
    </PrimeReactProvider>
  );
}

export default App;
