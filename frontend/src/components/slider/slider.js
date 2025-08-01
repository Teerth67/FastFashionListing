import React, { useEffect, useState } from 'react'
import "./Slider.scss"
import { sliderData } from './slider-data'
import { useNavigate } from 'react-router-dom'
import OptimizedImage from '../optimizeImage/optimizeImage'

const Slider = () => {
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)
    const slideLength = sliderData.length
    const autoScroll = true
    let slideInterval;
    const intervalTime = 5000

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
    }
    
    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
    }

    useEffect(() => {
        setCurrentSlide(0)
    }, [])

    useEffect(() => {
       if(autoScroll) {
        const auto = () => {
            slideInterval = setInterval(nextSlide, intervalTime)
        }
        auto()
       }
       return () => clearInterval(slideInterval)
    }, [currentSlide, intervalTime, autoScroll])

    return (
        <div className="slider">
            {sliderData.map((slide, index) => {
                const {image, heading, desc, link} = slide

               return (
                <div key={index} className={index === currentSlide ? "slide current" : "slide"}>
                    {index === currentSlide && (
                       <>
                       <OptimizedImage 
                           src={image} 
                           alt={heading} 
                           sliderMode={true}
                       />
                       <div className="content">
                        <span className="span1"></span>
                        <span className="span2"></span>
                        <span className="span3"></span>
                        <span className="span4"></span>
                        <h2>{heading}</h2>
                        {desc && <p>{desc}</p>}
                        <hr />
                        {link && (
                            <button 
                                className='--btn --btn-primary shop-button' 
                                onClick={() => navigate(link)}
                            >
                                {slide.heading === "EXCLUSIVE DROPS" ? "" : "Explore Now"}
                            </button>
                        )}
                       </div>
                       </>
                    )}
                </div>
               )
            })}
        </div>
    )
}

export default Slider