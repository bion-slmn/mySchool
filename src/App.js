import "./App.css";
import NavBar from "./Components/navBar";
import { Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Home from "./pages/home";
import Login from "./pages/login";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
