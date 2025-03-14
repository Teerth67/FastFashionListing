import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthManager from "./pages/auth/authManager";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import FooterLinks from "./components/footer/FooterLinks";
//import Footer from "./components/footer/Footer";
import Profile from "./pages/profile/Profile";
import Collections from "./pages/collections/Collections";
import Wishlist from "./pages/wishlist/Wishlist";
import MenCollection from "./pages/men/menspage";
import LadiesCollection from "./pages/women/ladies";
import BrandCollections from "./pages/brands/brandsCollection";
import CategoryCollections from "./pages/categories/categoryCollections";
import LadiesCategoryCollections from "./pages/categories/ladiesCollections";
import SaleGenderCategoryPage from "./pages/sales/salesCategory&GenderPage";
import SalePage from "./pages/sales/salesPage";
import SearchResultsPage from "./pages/SearchPage/SearchPage";
import AboutUs from "./pages/about/AboutUs";
import AboutUsPopup from "./pages/aboutUsPopup/AboutUsPopup";
import SaleGenderPage from "./pages/sales/salesGender";
import NotFound from "./pages/notfound/notFound";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import Disclaimer from "./pages/legal/Disclaimer";

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-88BG2J1T6Y";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-88BG2J1T6Y');
    `;
    document.head.appendChild(script2);
  }, []);
  // Save last visited page
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath !== "/") {
      localStorage.setItem("lastVisitedPage", currentPath);
    }
  }, [location.pathname]);

  return (
    <>
      <ToastContainer />
      <AboutUsPopup />
      <AuthManager>
      <Header />
      </AuthManager>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:source" element={<BrandCollections />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/men/:category" element={<CategoryCollections />} />
        <Route path="/women/:category" element={<LadiesCategoryCollections />} />
        <Route path="/sale/:gender" element={<SaleGenderPage />} />
        <Route path="/sales/:gender/:category" element={<SaleGenderCategoryPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/women" element={<LadiesCollection />} />
        <Route path="/men" element={<MenCollection />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      
      <FooterLinks />
    </>
  );
};

const App = () => {
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App