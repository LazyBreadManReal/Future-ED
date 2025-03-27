import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./assets/components/HomePage";
import LoginPage from "./assets/components/LoginPage";
import SignupPage from "./assets/components/SignupPage";
import LogoutPage from "./assets/components/LogoutPage";
import Archives from "./assets/components/Archives";
import BookPage from "./assets/components/BookPage";
import ContentUploadPage from "./assets/components/ContentUploadPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<ContentUploadPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/archives" element={<Archives />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </Router>
  );
}

export default App;
