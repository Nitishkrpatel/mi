import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import About from "./components/About";
import Alert from "./components/Alert";
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState("light");
  const [alertMessage, setAlert] = useState(null);
  const showAlert = (alertMessage, type) => {
    setAlert({
      msg: alertMessage,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  const removeBodyClassList = () => {
    document.body.classList.remove('bg-light');
    document.body.classList.remove('bg-primary');
    document.body.classList.remove('bg-success');
    document.body.classList.remove('bg-warning');
    document.body.classList.remove('bg-danger');
  };

  const toggleMode = (cls) => {
    removeBodyClassList();
    document.body.classList.add('bg-'+ cls);
    if (mode === "light") {
      setMode("dark");
      showAlert("Dark Mode Has been enabled", "success");
      document.body.style.backgroundColor = "grey";
      document.title = "Textutils - Dark Mode";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
      showAlert("Light Mode Has been enabled", "success");
      document.title = "Textutils - Light Mode";
    }
  };
  return (
    <>
      <BrowserRouter>
        {/* child components */}
        <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />
        <Alert alert={alertMessage} />
        <div className="container">
          <Routes>
            <Route exact path="/about" element={<About mode={mode} />} />
            <Route
              exact
              path="/"
              element={
                <TextForm
                  heading="Enter the text to analyze below"
                  mode={mode}
                  showAlert={showAlert}
                />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
