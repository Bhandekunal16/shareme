import React from "react";
import FileUploader from "./fileuploader";
import FileList from "./listFile";
import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/lara-light-cyan/theme.css";

        

function App() {
  return (
    <PrimeReactProvider>
      <FileUploader />
      <FileList />
    </PrimeReactProvider>
  );
}

export default App;
