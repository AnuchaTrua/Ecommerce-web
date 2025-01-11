import React from "react";
import { Link } from "react-router-dom";

const MainNav = () => {
  return (
    <nav className="bg-slate-500">
      <div className="px-4 mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-5">
            <Link to={"/"} className="font-bold text-2x1">LOGO</Link>

            <Link to={"/"}>Home</Link>
            <Link to={"shop"}>Shop</Link>
            <Link to={"cart"}>Cart</Link>
          </div>

          <div className="flex items-center gap-5">
            <Link to={"register"}>Register</Link>
            <Link to={"login"}>Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
