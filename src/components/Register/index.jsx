import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [creds, setCreds] = useState({
    first_name: "",
    last_name: "",
    login_name: "",
    password: "",
    confirmPassword: "",
    location: "",
    description: "",
    occupation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    console.log("Register credentials:", creds);
    // Kiểm tra điều kiện cơ bản
    if (
      !creds.login_name ||
      !creds.password ||
      !creds.first_name ||
      !creds.last_name
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      setSuccess("");
      return;
    }

    if (creds.password !== creds.confirmPassword) {
      setError("Mật khẩu không khớp.");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          first_name: creds.first_name,
          last_name: creds.last_name,
          location: creds.location,
          description: creds.description,
          occupation: creds.occupation,
          login_name: creds.login_name,
          password: creds.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError("Lỗi: " + errorText);
        setSuccess("");
        return;
      }

      const result = await response.json();
      onRegister?.(result);
      setError("");
      setSuccess("Đăng ký thành công!");
      setCreds({
        first_name: "",
        last_name: "",
        login_name: "",
        password: "",
        confirmPassword: "",
        location: "",
        description: "",
        occupation: "",
      });
      // Điều hướng về trang login (nếu cần)
      // navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Đã xảy ra lỗi khi kết nối với server.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Đăng ký tài khoản</h2>

      <label>First Name*</label>
      <input
        type="text"
        value={creds.first_name}
        onChange={(e) => setCreds({ ...creds, first_name: e.target.value })}
      />

      <label>Last Name*</label>
      <input
        type="text"
        value={creds.last_name}
        onChange={(e) => setCreds({ ...creds, last_name: e.target.value })}
      />
      <br />

      <label>Login Name*</label>
      <input
        type="text"
        value={creds.login_name}
        onChange={(e) => setCreds({ ...creds, login_name: e.target.value })}
      />
      <br />

      <label>Password*</label>
      <input
        type="password"
        value={creds.password}
        onChange={(e) => setCreds({ ...creds, password: e.target.value })}
      />
      <br />

      <label>Confirm Password*</label>
      <input
        type="password"
        value={creds.confirmPassword}
        onChange={(e) =>
          setCreds({ ...creds, confirmPassword: e.target.value })
        }
      />
      <br />

      <label>Location</label>
      <input
        type="text"
        value={creds.location}
        onChange={(e) => setCreds({ ...creds, location: e.target.value })}
      />
      <br />

      <label>Description</label>
      <textarea
        value={creds.description}
        onChange={(e) => setCreds({ ...creds, description: e.target.value })}
      
      
      />
      <br />

      <label>Occupation</label>
      <input
        type="text"
        value={creds.occupation}
        onChange={(e) => setCreds({ ...creds, occupation: e.target.value })}
      />
      <br />

      <button onClick={handleRegister} style={{ marginTop: 10 }}>
        Register Me
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Register;
