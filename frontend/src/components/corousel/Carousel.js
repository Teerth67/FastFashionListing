import React from 'react'
import "react-multi-carousel/lib/styles.css"
import "./Carousel.scss"
import b1 from "../../assets/b1.jpg"
import b2 from "../../assets/b2.png"
import b4 from "../../assets/b4.jpg"

import b5 from "../../assets/b5.png"
import b6 from "../../assets/b6.jpeg"
import b7 from "../../assets/b7.jpeg"
import b8 from "../../assets/b8.jpg"
// import b9 from "../../assets/b9.png"
import b10 from "../../assets/b10.png"
import b11 from "../../assets/b11.jpg"
import b12 from "../../assets/b12.png"
import b13 from "../../assets/b13.png"
import b14 from "../../assets/b14.png"
import b15 from "../../assets/b15.png"
import b16 from "../../assets/b16.png"
import b17 from "../../assets/b17.png"
import b19 from "../../assets/b19.png"
import b20 from "../../assets/b20.jpg"
import b21 from "../../assets/b21.png"
import b22 from "../../assets/b22.webp"
import b23 from "../../assets/b23.png"
import b24 from "../../assets/b24.webp"
import b25 from "../../assets/b25.jpg"

const ProductCarousel=() => {
    const brands = [
    {src:b1},
   
    {src:b2},
    {src:b17},
    {src:b16},
    {src:b15},
    {src:b4},
    {src:b5},
    {src:b19},
    {src:b13},
    {src:b6},
    {src:b7},
    {src:b14},
    {src:b21},

    {src:b8},
    // {src:b9},
    {src:b20},
    {src:b10},
    {src:b23},

    {src:b11},
    {src:b12},
    {src:b22},
    
    {src:b24},
    {src:b25}


        ];
      return (
        <div className="carousel-wrapper">
            <div className="carousel-container">
                <div className="carousel-track">
                    {[...brands, ...brands].map((brand, index) => (
                        <img key={index} src={brand.src} alt={brand.alt} className="carousel-item" />
                    ))}
                </div>
            </div>
        </div>
      );
    };
    
    export default ProductCarousel;