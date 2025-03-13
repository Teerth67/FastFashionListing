import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaUserCircle, FaHeart, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaSearch } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { RESET_AUTH, logout } from "../../redux/features/auth/authSlice";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hiddenLink";
import { UserName } from "../../pages/profile/Profile";
import DropdownMenu from "../Dropdown/Dropdown";
import { SearchBar } from "../search/Search";
import logoImg from "../../assets/logo.png"


const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = ({ openLogin, openRegister }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrollPage, setScrollPage] = useState(false);
  const [isSearchExpanded, setSearchExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isMobile, setIsMobile] = useState(false);
  const logoElement = (
    <div className={styles.logo}>
      <Link
        to="/"
        onClick={(e) => {
          if (window.location.pathname === "/") {
            e.preventDefault(); // Prevent navigation and force reload
            setShowMenu(false); // Close the menu before reloading
            window.location.reload();
          } else {
            setShowMenu(false); // Also close menu when navigating to home from another page
          }
        }}
       >
      <img src={logoImg} alt="Glitch'd Logo" />
      </Link>
    </div>
  );
  // Handle scroll for navbar
  useEffect(() => {
    const fixNavbar = () => {
      if (window.scrollY > 50) {
        setScrollPage(true);
      } else {
        setScrollPage(false);
      }
    };

    window.addEventListener("scroll", fixNavbar);
    return () => window.removeEventListener("scroll", fixNavbar);
  }, []);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 820);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add effect to close menu when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Only apply this logic when menu is open and we're in mobile view
      if (showMenu && isMobile) {
        const navElement = document.querySelector(`.${styles.nav}`);
        const menuIcon = document.querySelector(`.${styles["menu-icon"].replace(/[+]/g, "\\+")}`);
        // Check if click is outside both the nav menu and the menu icon
        if (navElement && 
            !navElement.contains(e.target) && 
            menuIcon && 
            !menuIcon.contains(e.target)) {
          setShowMenu(false);
        }
      }
    };
    
    // Add the event listener to the document
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showMenu, isMobile]);

  const toggleMenu = () => setShowMenu(!showMenu);
  const hideMenu = () => setShowMenu(false);

  const logoutUser = async () => {
    await dispatch(logout());
    await dispatch(RESET_AUTH());
    navigate("/");
  };

  const toggleSearch = () => {
    setSearchExpanded(!isSearchExpanded);
  };

  return (
    <header className={isHomePage && !scrollPage ? `${styles.transparent}` : `${styles.fixed}`}>
      <div className={styles.announcement}>
        <p>New szn, new drops! Explore the latest collection</p>
      </div>
      <div className={styles.header}>
        {logoElement}
        <nav className={`${styles.nav} ${showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`}`}>
          <div
            className={showMenu ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}` : `${styles["nav-wrapper"]}`}
            onClick={hideMenu}
          ></div>

          <ul>
            <li className={styles["logo-mobile"]}>
              <div className={styles.logoMobile}>
                <Link to="/" onClick={(e) => {
                  hideMenu(); // Close the menu
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    window.location.reload();
                  }
                }}>
                  <img src={logoImg} alt="Glitch'd Logo" />
                </Link>
              </div>
              <FaTimes size={22} color="#000" onClick={hideMenu} />
            </li>
          </ul>

          <div className={styles["header-right"]}>
            <span className={styles.links}>
            <ShowOnLogin>
  <NavLink to="/profile" className={activeLink} onClick={hideMenu}>
    <FaUserCircle color="rgb(38, 38, 38)" />
    <span className={styles.mobileOnly}><UserName /></span>
  </NavLink>
</ShowOnLogin>



              {isMobile && (
                <div className={styles.mobileDropdownWrapper}>
                  <DropdownMenu isMobileOpen={showMenu} />
                </div>
              )}

              <ShowOnLogout>
                <span className={styles.loginText} onClick={openLogin}>
                  <FaSignInAlt color="rgb(38, 38, 38)"  />
                  <span className={styles.mobileOnly}>Login</span>
                </span>
              </ShowOnLogout>

              <ShowOnLogout>
                <span className={styles.registerText} onClick={openRegister}>
                  <FaUserPlus color="rgb(38, 38, 38)"  />
                  <span className={styles.mobileOnly}>Register</span>
                </span>
              </ShowOnLogout>

              <ShowOnLogin>
  <NavLink to="/wishlist" className={`${activeLink} ${styles.wishlist}`} onClick={hideMenu}>
    <FaHeart color="rgb(38, 38, 38)" />
    <span className={styles.mobileOnly}>Wishlist</span>
  </NavLink>
</ShowOnLogin>

              <ShowOnLogin>
                <Link to="/" onClick={logoutUser}>
                  <FaSignOutAlt color="rgb(38, 38, 38)"  />
                  <span className={styles.mobileOnly}>Logout</span>
                </Link>
              </ShowOnLogin>
            </span>
          </div>
        </nav>

        {/* Search Bar and Menu Icon */}
        <div className={styles["header-search-menu"]}>
          <div className={styles.searchBar}>
            {/* Search Icon for Mobile */}
            <div className={styles.mobileSearch}>
              <FaSearch size={20} color="rgb(38, 38, 38)" onClick={toggleSearch}  />
              {isSearchExpanded && (
                <div className={styles.expandedSearch}>
                  <SearchBar />
                </div>
              )}
            </div>
            {/* Search Bar for Desktop */}
            <div className={styles.desktopSearch}>
              <SearchBar />
            </div>
          </div>
          <div className={styles["menu-icon"]}>
            <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {!isMobile && (scrollPage || !isHomePage) && (
        <div className={styles.dropdownWrapper}>
          <DropdownMenu isMobileOpen={false} />
          
        </div>
      )}
    </header>
  );
};

export default Header;