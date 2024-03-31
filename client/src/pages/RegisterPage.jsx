import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { NavLink } from "react-router-dom";

const RegisterPage = () => {
  const { registerUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(username, email, password);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h2 className="register-title">Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-username">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>
          <div className="register-email">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </div>
          <div className="register-password">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>{" "}
          {!isLoading ? (
            <button className="register-button" type="submit">
              Register
            </button>
          ) : (
            <button disabled>Loading..</button>
          )}
          <p className="login-register">
            You already have an account?{" "}
            <NavLink to="/" className="register-link">
              Login here
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
