"use client";

import { useState, useRef } from "react";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { Tabs } from "antd";
import ProductCard from "./Products/ProductCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Categories = () => {
  const swiperRef = useRef(null);
  const { data: categories } = useGetAllCategoriesQuery();
  const { data: productData } = useGetAllProductsQuery();

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const [activeCategory, setActiveCategory] = useState(
    activeCategories?.[0]?._id
  );

  const filteredProducts = activeProducts?.filter(
    (product) => product?.category?._id === activeCategory
  );

  return (
    <section className="my-container">
      <div className="flex flex-col lg:flex-row items-center justify-between border-b">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-5">
          All Categories
        </h2>
        <Tabs
          defaultActiveKey={activeCategories?.[0]?._id}
          size="large"
          className="font-semibold max-w-[600px] px-5 lg:px-0"
          onChange={(key) => setActiveCategory(key)}
        >
          {activeCategories?.map((category) => (
            <Tabs.TabPane tab={category?.name} key={category?._id} />
          ))}
        </Tabs>
      </div>
      {filteredProducts?.length > 0 ? (
        <div className="relative mt-5">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            loop={true}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="mySwiper my-10"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product?._id}>
                <ProductCard item={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex items-center justify-center gap-5">
            <button
              className="absolute top-[45%] -left-2 lg:z-50 lg:w-8 lg:h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <FaAngleLeft className="text-xl" />
            </button>
            <button
              className="absolute top-[45%] -right-2 lg:z-50 lg:w-8 lg:h-8 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <FaAngleRight className="text-xl" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl font-semibold my-10">
          No products found for this category.
        </div>
      )}
    </section>
  );
};

export default Categories;
