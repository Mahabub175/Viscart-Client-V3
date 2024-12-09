import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Modal, Rate } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const QuickProductView = ({
  item,
  isModalVisible,
  handleModalClose,
  isWishlist,
  wishlistId,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const pathname = usePathname();
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const groupedAttributes = item?.variants?.reduce((acc, variant) => {
    variant.attributeCombination.forEach((attribute) => {
      const attributeName = attribute.attribute.name;
      if (!acc[attributeName]) {
        acc[attributeName] = [];
      }
      if (!acc[attributeName].some((opt) => opt.name === attribute.name)) {
        acc[attributeName].push({
          name: attribute.name,
          label: attribute.label || attribute.name,
          _id: attribute._id,
        });
      }
    });
    return acc;
  }, {});

  const handleAttributeSelect = (attributeName, option) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setCurrentVariant(null);
    } else {
      const updatedVariant = item?.variants.find((variant) =>
        Object.entries(selectedAttributes).every(
          ([attrName, selectedValue]) => {
            return variant.attributeCombination.some(
              (attr) =>
                attr.attribute.name === attrName && attr.name === selectedValue
            );
          }
        )
      );
      setCurrentVariant(updatedVariant);
    }
  }, [selectedAttributes, item?.variants]);

  const currentPrice = currentVariant
    ? currentVariant?.sellingPrice
    : item?.sellingPrice;

  const currentImage = currentVariant?.image
    ? formatImagePath(currentVariant?.image)
    : ["/products", "/wishlist", "/compare"].includes(pathname)
    ? item?.mainImage
    : formatImagePath(item?.mainImage);

  return (
    <Modal
      open={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
      centered
      loading={!item}
      width={850}
    >
      <div className="flex flex-col items-center justify-center lg:flex-row gap-10 pt-5">
        <div className="w-full">
          <Image
            src={currentImage}
            alt={item?.name}
            width={300}
            height={300}
            className="w-full h-[300px] object-contain rounded-xl"
          />
        </div>

        <div className="w-full">
          <h2 className="text-xl font-semibold">{item?.name}</h2>
          <div className="flex items-center mt-4 gap-4 font-bold">
            <Rate disabled value={item?.ratings?.average} allowHalf /> (
            {item?.ratings?.count})
          </div>
          <p>{item?.details}</p>

          {item?.brand && (
            <p className="font-bold my-2 text-textColor">
              Brand: {item?.brand?.name}
            </p>
          )}
          <p className="font-bold my-2 text-textColor">
            Category: {item?.category?.name}
          </p>

          {groupedAttributes &&
            Object.entries(groupedAttributes).map(
              ([attributeName, options]) => (
                <div key={attributeName} className="flex flex-col gap-2 my-4">
                  <span className="font-bold">{attributeName}:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {options.map((option) => (
                      <div
                        key={option._id}
                        className={`cursor-pointer px-4 py-2 border-2 rounded-lg ${
                          selectedAttributes[attributeName] === option.name
                            ? "border-primary bg-primary-light text-primary font-bold"
                            : "border-gray-300"
                        }`}
                        style={
                          attributeName === "Color"
                            ? {
                                backgroundColor: option.label,
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                border:
                                  selectedAttributes[attributeName] ===
                                  option.name
                                    ? "2px solid #000"
                                    : "1px solid #ccc",
                              }
                            : {}
                        }
                        onClick={() =>
                          handleAttributeSelect(attributeName, option.name)
                        }
                      >
                        {attributeName.toLowerCase() !== "color" && (
                          <span>{option.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

          <div className="flex items-center gap-4 text-textColor font-bold my-2">
            Price:
            <p className="text-primary text-xl">
              {globalData?.results?.currency + " " + currentPrice}
            </p>
          </div>

          <hr />

          <ProductCountCart
            item={item}
            handleModalClose={handleModalClose}
            previousSelectedVariant={currentVariant}
            setPreviousSelectedVariant={setCurrentVariant}
            fullWidth
            isWishlist={isWishlist}
            wishlistId={wishlistId}
            selectedPreviousAttributes={selectedAttributes}
          />
        </div>
      </div>
    </Modal>
  );
};

export default QuickProductView;
