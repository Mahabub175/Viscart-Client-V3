"use client";

import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCompareMutation } from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddWishlistMutation } from "@/redux/services/wishlist/wishlistApi";
import { Tooltip } from "antd";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaCodeCompare } from "react-icons/fa6";
import { TbHeart, TbListDetails } from "react-icons/tb";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const QuickViewHover = ({ item }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const [addWishlist] = useAddWishlistMutation();
  const [addCompare] = useAddCompareMutation();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const addToWishlist = async (id) => {
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: id,
    };

    const toastId = toast.loading("Adding to wishlist");

    try {
      const res = await addWishlist(data);
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
      toast.error("Failed to add item to wishlist.", { id: toastId });
    }
  };

  const addToCompare = async (id) => {
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: [id],
    };

    const toastId = toast.loading("Adding to Compare");

    try {
      const res = await addCompare(data);
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to Compare:", error);
      toast.error("Failed to add item to Compare.", { id: toastId });
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 lg:gap-4 px-3 py-4 bg-white lg:bg-transparent">
      <Tooltip placement="top" title={"Quick View"}>
        <div
          className="lg:text-xl cursor-pointer hover:scale-110 duration-300 text-white bg-primary rounded-full p-2"
          onClick={showModal}
        >
          <AiOutlineFullscreen />
        </div>
      </Tooltip>

      <Tooltip placement="top" title={"Details"}>
        <Link
          href={`/products/${item?.slug}`}
          className="lg:text-xl cursor-pointer hover:scale-110 duration-300 text-white bg-primary rounded-full p-2"
        >
          <TbListDetails />
        </Link>
      </Tooltip>

      <Tooltip placement="top" title={"Add to Wishlist"}>
        <div
          className="lg:text-xl cursor-pointer hover:scale-110 duration-300 text-white bg-primary rounded-full p-2"
          onClick={() => addToWishlist(item?._id)}
        >
          <TbHeart />
        </div>
      </Tooltip>

      <Tooltip placement="top" title={"Add to Compare"}>
        <div
          className="lg:text-xl cursor-pointer hover:scale-110 duration-300 text-white bg-primary rounded-full p-2"
          onClick={() => addToCompare(item?._id)}
        >
          <FaCodeCompare className="rotate-90" />
        </div>
      </Tooltip>

      <QuickProductView
        item={item}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default QuickViewHover;
