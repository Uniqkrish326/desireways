// src/components/Banner.js
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
    const images = [
        'https://t4.ftcdn.net/jpg/02/49/50/15/360_F_249501541_XmWdfAfUbWAvGxBwAM0ba2aYT36ntlpH.jpg',
        'https://www.shutterstock.com/image-vector/banner-big-sale-blue-podium-260nw-2493210727.jpg',
        'https://png.pngtree.com/thumb_back/fh260/background/20190813/pngtree-beautiful-diwali-background-image_287752.jpg'
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false
    };

    return (
        <div className="banner-container">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="slide">
                        <img
                            src={image}
                            alt={`Slide ${index}`}
                            className="banner-image"
                        />
                    </div>
                ))}
            </Slider>
            <div className="overlay"></div>

            <style jsx>{`
                .banner-container {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    max-height: 500px;
                }

                .slide {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .banner-image {
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                    filter: brightness(1.1); /* Slightly increase brightness */
                }

                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0)); /* Lighter overlay */
                }

                @media (max-width: 768px) {
                    .banner-container {
                        max-height: 300px;
                    }
                    .overlay {
                        background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
                    }
                }

                @media (max-width: 480px) {
                    .banner-container {
                        max-height: 200px;
                    }
                    .overlay {
                        background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
                    }
                }
            `}</style>
        </div>
    );
};

export default Banner;
