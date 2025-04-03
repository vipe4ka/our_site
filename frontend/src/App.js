import { Routes, Route } from "react-router";
import "./App.css";
import LoginForm from "./components/LoginForm";
import MainPage from "./components/MainPage";
import About from "./components/About";
import NotFound from "./components/NotFound";
import UserPage from "./components/UserPage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/sing-in" element={<LoginForm isRegist={true} />}></Route>
        <Route path="/log-in" element={<LoginForm isRegist={false} />}></Route>
        <Route path="/user/:nickname" element={<UserPage />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
