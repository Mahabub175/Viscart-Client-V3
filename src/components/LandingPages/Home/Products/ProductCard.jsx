import { Tooltip } from "antd";
import Image from "next/image";
import React from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import Link from "next/link";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { usePathname } from "next/navigation";

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const pathname = usePathname();

  return (
    <div className="border hover:border-primary duration-300 rounded-xl shadow-xl relative group w-[200px] h-[400px] lg:w-[300px] lg:h-[450px] mx-auto bg-white">
      {item?.stock > 0 ? (
        <div className="absolute top-2 right-2 p-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded font-bold text-xs z-10">
          In Stock
        </div>
      ) : (
        <div className="absolute top-2 right-2 p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10">
          Out Of Stock
        </div>
      )}
      <div className="relative overflow-hidden rounded-t-xl">
        <Image
          src={
            pathname === "/products"
              ? item?.mainImage
              : formatImagePath(item?.mainImage)
          }
          alt={item?.name}
          width={300}
          height={260}
          className="rounded-t-xl h-[160px] lg:h-[260px] group-hover:scale-110 duration-500"
        />

        <div className="hidden lg:block absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 duration-500 z-10">
          <QuickViewHover item={item} />
        </div>
        <div className="lg:hidden">
          <QuickViewHover item={item} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-b-xl">
        <Link href={`/products/${item?.slug}`}>
          <h2 className="text-start font-normal text-textColor text-sm">
            {item?.category?.name}
          </h2>
          <Tooltip placement="top" title={item?.name}>
            <h2 className="lg:text-lg text-start font-semibold mt-2 mb-6">
              {item?.name.length > 50
                ? item.name.slice(0, 50).concat("...")
                : item.name}
            </h2>
          </Tooltip>

          <div className="flex items-center gap-4 justify-start absolute bottom-5">
            {item?.offerPrice && (
              <p className="text-base font-bold line-through text-red-500">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
            {item?.offerPrice ? (
              <p className="text-primary lg:text-2xl font-bold">
                {globalData?.results?.currency + " " + item?.offerPrice}
              </p>
            ) : (
              <p className="text-primary lg:text-2xl font-bold">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
