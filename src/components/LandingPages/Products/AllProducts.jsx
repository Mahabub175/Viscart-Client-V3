"use client";

import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetProductsQuery } from "@/redux/services/product/productApi";
import { Pagination, Slider, Checkbox, Select, Button, Modal } from "antd";
import { useState } from "react";
import { paginationNumbers } from "@/assets/data/paginationData";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import ProductCard from "../Home/Products/ProductCard";

const { Option } = Select;

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sorting, setSorting] = useState("");
  const [filterModal, setFilterModal] = useState(false);

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: brandData } = useGetAllBrandsQuery();
  const { data: categoryData } = useGetAllCategoriesQuery();
  const { data: productData } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: "",
  });

  const activeBrands = brandData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const activeCategories = categoryData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const activeProducts = productData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
  };

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleSortingChange = (value) => {
    setSorting(value);
  };

  const filteredProducts = activeProducts
    ?.filter((product) => {
      const isBrandMatch = selectedBrands.length
        ? selectedBrands.includes(product?.brand?.name)
        : true;
      const isCategoryMatch = selectedCategories.length
        ? selectedCategories.includes(product?.category?.name)
        : true;
      const isPriceMatch =
        product.sellingPrice >= priceRange[0] &&
        product.sellingPrice <= priceRange[1];
      return isBrandMatch && isCategoryMatch && isPriceMatch;
    })
    ?.sort((a, b) => {
      if (sorting === "PriceLowToHigh") {
        return a.sellingPrice - b.sellingPrice;
      }
      if (sorting === "PriceHighToLow") {
        return b.sellingPrice - a.sellingPrice;
      }
      return 0;
    });
  return (
    <section className="container mx-auto lg:px-5 py-10 relative -mt-10 lg:-mt-0">
      <div className="bg-gray-200 flex items-center gap-2 justify-between py-3 px-6 mb-6 rounded-xl">
        <p className="text-sm lg:text-base">
          There are{" "}
          <span className="font-semibold">{filteredProducts?.length}</span>{" "}
          products showing.
        </p>
        <div className="flex items-center lg:w-1/4">
          <Select
            allowClear
            placeholder="Select Sorting"
            style={{ width: "100%" }}
            onChange={handleSortingChange}
          >
            <Option value="PriceLowToHigh">Price Low To High</Option>
            <Option value="PriceHighToLow">Price High To Low</Option>
          </Select>
        </div>
        <Button
          type="primary"
          className="lg:hidden"
          onClick={() => setFilterModal(true)}
        >
          Advance Filter
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-1/4 p-4 border rounded-lg shadow-sm lg:sticky top-10 hidden lg:block">
          <h2 className="mb-4 text-lg font-semibold">Filter Products</h2>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Brands</label>
            <Checkbox.Group
              options={activeBrands?.map((brand) => ({
                label: brand.name,
                value: brand.name,
              }))}
              value={selectedBrands}
              onChange={handleBrandChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Categories</label>
            <Checkbox.Group
              options={activeCategories?.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
              value={selectedCategories}
              onChange={handleCategoryChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Price Range</label>
            <Slider
              range
              min={0}
              max={10000}
              defaultValue={[0, 10000]}
              value={priceRange}
              onChange={handlePriceChange}
              step={50}
              tooltip={{
                formatter: (value) =>
                  `${globalData?.results?.currency} ${value}`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>{globalData?.results?.currency + " " + priceRange[0]}</span>
              <span>{globalData?.results?.currency + " " + priceRange[1]}</span>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          <div>
            {filteredProducts?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 overflow-x-hidden">
                  {filteredProducts?.map((product) => (
                    <ProductCard key={product?._id} item={product} />
                  ))}
                </div>
                <Pagination
                  className="flex justify-end items-center !mt-10"
                  total={productData?.meta?.totalCount}
                  current={currentPage}
                  onChange={handlePageChange}
                  pageSize={pageSize}
                  showSizeChanger
                  pageSizeOptions={paginationNumbers}
                  simple
                />
              </>
            ) : (
              <p className="text-center text-gray-500 mt-32 text-xl">
                No products found.
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal
        open={filterModal}
        onCancel={() => setFilterModal(false)}
        footer={null}
        centered
      >
        {" "}
        <div className="w-full p-4">
          <h2 className="mb-4 text-lg font-semibold">Filter Products</h2>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Brands</label>
            <Checkbox.Group
              options={activeBrands?.map((brand) => ({
                label: brand.name,
                value: brand.name,
              }))}
              value={selectedBrands}
              onChange={handleBrandChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Categories</label>
            <Checkbox.Group
              options={activeCategories?.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
              value={selectedCategories}
              onChange={handleCategoryChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Price Range</label>
            <Slider
              range
              min={0}
              max={10000}
              defaultValue={[0, 10000]}
              value={priceRange}
              onChange={handlePriceChange}
              step={50}
              tooltip={{
                formatter: (value) =>
                  `${globalData?.results?.currency} ${value}`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>{globalData?.results?.currency + " " + priceRange[0]}</span>
              <span>{globalData?.results?.currency + " " + priceRange[1]}</span>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default AllProducts;
