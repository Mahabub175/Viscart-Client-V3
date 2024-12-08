"use client";

import Link from "next/link";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";

const BottomNavigation = () => {
  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);

  const navItems = [
    { name: "Product", href: "/products", icon: <AppstoreOutlined /> },
    { name: "Wishlist", href: "/wishlist", icon: <HeartOutlined /> },
    { name: "Cart", href: "/cart", icon: <ShoppingCartOutlined /> },
  ];

  if (data?.role) {
    navItems.push({
      name: "Dashboard",
      href: `/${data.role}/dashboard`,
      icon: <TbLayoutDashboardFilled />,
    });
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-300 shadow-md lg:hidden">
      <div className="flex justify-around items-center py-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center text-gray-600 hover:text-primary transition"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
