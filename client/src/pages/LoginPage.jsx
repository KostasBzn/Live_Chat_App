import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { NavLink } from "react-router-dom";

const LoginPage = () => {
  const { loginUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-email">
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
            <div className="login-password">
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
              <button className="login-button" type="submit">
                Login
              </button>
            ) : (
              <button disabled>Loading..</button>
            )}
            <p className="login-register">
              You don't have an account?{" "}
              <NavLink to="/register" className="register-link">
                Register here
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
