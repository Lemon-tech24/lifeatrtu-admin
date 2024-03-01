/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";

function App() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      console.log(response.data);
    } catch (error) {
      setError("Invalid username or password");
    }
  };
  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="text-2xl"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </>
  );
}

export default App;
