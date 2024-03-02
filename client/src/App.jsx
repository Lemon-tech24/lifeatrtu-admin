import Home from "./components/Home";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<AuthenticatedRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
function AuthenticatedRoute() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/check");

        const data = response.data;

        if (data.ok) {
          return setAuth(true);
        }

        return setAuth(false);
      } catch (err) {
        console.error(err);
      }
    };

    checkAuth();

    return () => setAuth(false);
  }, []);

  if (auth) {
    return <Home />;
  } else {
    return <Navigate to="/" />;
  }
}

export default App;
