// Register.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils";
import { RESET_AUTH, login, register } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import styles from "./auth.module.scss";

const Register = ({ isModalOpen, closeModal, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { name, email, password, cPassword } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, isSuccess } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
  
    // Form validation
    if (!name || !email || !password || !cPassword) {
      return toast.error("All fields are required!");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email!");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }
    if (password !== cPassword) {
      return toast.error("Passwords do not match!");
    }
  
    const userData = { name, email, password };
  
    try {
      const response = await dispatch(register(userData)).unwrap();
  
      if (response.token) {
        // Save token from registration response
        localStorage.setItem("token", response.token);
        
        // If you need user data too
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        
        toast.success("Registered successfully!");
        navigate("/"); // Redirect after registration
        closeModal(); // Close the modal
      } else {
        toast.error("Registration failed - no token received");
      }
    } catch (error) {
      // console.log("Registration error:", error);
      
      // Check if it's a rejected action with a payload
      if (error.name === 'RejectWithValue' || error.status === 400) {       toast.error("Email is already registered. Please login instead.");
       
      } 
    }
  };
  

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
      closeModal();
    }
    dispatch(RESET_AUTH());
  }, [isSuccess, isLoggedIn, dispatch, navigate, closeModal]);

  if (!isModalOpen) return null;

  return (
    <>
      {isLoading && <Loader />}

      <div className={styles.auth} onClick={closeModal}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={closeModal}>
            ✕
          </button>

          <div className={styles.form}>
            <h2>Register</h2>
            <p>Join us to access exclusive deals, offers, and discounts.</p>

            <form onSubmit={registerUser}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={styles.showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  name="cPassword"
                  value={cPassword}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className={styles.signInButton}>
                Register
              </button>
            </form>

            <div className={styles.membershipLink}>
              <p>Already have an account?</p>
              <button 
                type="button"
                className={styles.textLink}
                onClick={switchToLogin}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;