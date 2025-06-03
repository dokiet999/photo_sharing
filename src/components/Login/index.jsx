import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({onLogin}) {
  const [creds, setCreds] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
          const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {  // ✅ sửa đúng
          Accept: "application/json",  // ✅ sửa đúng
          "Content-Type": "application/json"
        },
        credentials: "include", // ✅ cần để gửi cookie session từ server
        body: JSON.stringify(creds),
      });

    console.log(creds);
      if (response.ok) {
        onLogin?.({ login_name: creds.login_name });
        navigate("/users");
      } else {
        setError("Invalid username or password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed!");
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <br />
      <label>Username:</label>
      <br />
      <input
        type="text"
        onChange={(e) => setCreds({ ...creds, login_name: e.target.value })}
      />
      <br />
      <label>Password:</label>
      <br />
      <input
        type="password"
        onChange={(e) => setCreds({ ...creds, password: e.target.value })}
      />
      <br />
      <br />
      <button onClick={handleLogin}>Login</button>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={() => navigate("/register")}>Register</button>

    </div>
  );
}

export default Login;