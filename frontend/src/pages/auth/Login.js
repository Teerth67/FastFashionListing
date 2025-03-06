
// Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils";
import { RESET_AUTH, login } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import styles from "./auth.module.scss";

const Login = ({ isModalOpen, closeModal, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, isSuccess } = useSelector((state) => state.auth);

  const loginUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required!");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email!");
    }
    const userData = { email, password };
    await dispatch(login(userData));
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
            <h2>Sign in</h2>
            <p>
              Become a member — don't miss out on deals, offers, discounts and bonus vouchers.
            </p>

            <form onSubmit={loginUser}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>

              <div className={styles.rememberForgot}>
                <label>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                {/* <button 
                  type="button" 
                  className={styles.textLink}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button> */}
              </div>

              <button type="submit" className={styles.signInButton}>
                Sign in
              </button>

              <button
                type="button"
                className={styles.becomeMember}
                onClick={switchToRegister}
              >
                Become a member
              </button>
            </form>

            <div className={styles.membershipLink}>
              <button 
                type="button" 
                className={styles.textLink}
                onClick={switchToRegister}
              >
                Membership
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;