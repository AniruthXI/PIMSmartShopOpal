import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import slide1 from "../../public/images/slide1.jpg";
import slide2 from "../../public/images/slide2.jpg";
import slide3 from "../../public/images/slide3.jpg";

import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 3000,
        arrows: false,
        autoplay: true,
    };

    const settings2 = { 
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        className: "slider2", // เพิ่ม className เพื่อใช้กำหนด style แยก
    };

    const slides = [slide1,slide2,slide3];

    return (
        <div className="mb-2 sm:m-[100px] block flex flex-col gap-4">
            {/* Larger carousel */}
            <div>
                <Slider {...settings}>
                    {slides.map((src, index) => (
                        <div key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} className="object-cover w-full h-full"/>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default ProductCarousel;
