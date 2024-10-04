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
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
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

    return (
        <div className="mb-2 lg:block xl:block md:block m-[100px] flex flex-col gap-4">
            {/* Larger carousel */}
            <div className="w-full">
                <Slider {...settings}>
                    <div>
                        <img src={slide1} alt="Slide 1" />
                    </div>
                    <div>
                        <img src={slide2} alt="Slide 2" />
                    </div>
                    <div>
                        <img src={slide3} alt="Slide 3" />
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default ProductCarousel;
