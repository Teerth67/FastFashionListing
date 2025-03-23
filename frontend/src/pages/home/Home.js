import React, { useState, useEffect } from "react";
import Slider from "../../components/slider/slider";
import "./Home.scss";
import ParallaxSection from "../../components/Parallex/Parallex";
import HomeInfoBox from "./HomeInfoBox";
import { productData } from "../../components/corousel/data";
import CarouselItem from "../../components/corousel/CarouselItem";
import ProductCarousel from "../../components/corousel/Carousel";
import ParallaxSection2 from "../../components/Parallex2/Parallex";
import SplashScreen from "../splashScreen/splashScreen";
import { useNavigate } from "react-router-dom";
import StreetWearCards from "../../components/productCard/streetwearCardSlider"; // Import the new component
import CasualCards from "../../components/productCard/casualCard"
const PageHeading = ({ heading, btnText }) => {
  return (
    <>
      <div className="--flex-between">
        <h2 className="--fw-thin">{heading}</h2>
        <button className="--btn">{btnText}</button>
      </div>
      <div className="--hr"></div>
    </>
  );
};

const Home = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const navigate = useNavigate();

  // Hide splash screen and show home page
  const handleSplashFinish = () => {
    setIsSplashVisible(false);
    
    // Scroll to top and reset route if reloaded
    window.scrollTo(0, 0);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    // Check for page reload
    if (performance.navigation.type === 1) {
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Reset to home route
      navigate("/", { replace: true });
      
      // Reset splash screen state
      setIsSplashVisible(true);
    }

    // Prevent browser's default scroll restoration
    window.history.scrollRestoration = "manual";
  }, [navigate]);

  const productsList = productData.map((item, index) => (
    <div key={index}>
      <CarouselItem
        name={item.name}
        url={item.imageurl}
        price={item.price}
        description={item.description}
      />
    </div>
  ));

  return (
    <>
      {isSplashVisible ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <div className="home-content">
          <Slider />

          {/* Add the new ProductCards section here */}
          {/* */}


          <section className="products-section">
            <div className="container">
              <ProductCarousel products={productsList} />
            </div>
          </section>
 <StreetWearCards />
 <CasualCards/>
          <ParallaxSection />
          <ParallaxSection2 />

          <section className="products-section">
            <div className="container">
              <ProductCarousel products={productsList} />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Home;