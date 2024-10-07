import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = ({ userInfo, logoutHandler }) => {

  return (
    <ul className="absolute md:right-0 mt-2 mr-14 space-y-2 bg-[#151515] text-gray-600 p-2 rounded shadow-lg w-auto z-20">
      {userInfo.isAdmin && (
        <>
          <li>
            <NavLink
              className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm whitespace-nowrap"
              to="/admin/dashboard"
              style={({ isActive }) => ({
                color: isActive ? "#0a7734" : "white",
              })}
            >
              Admin Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm whitespace-nowrap"
              to="/admin/categorylist"
              style={({ isActive }) => ({
                color: isActive ? "#0a7734" : "white",
              })}
            >
              Create Category
            </NavLink>
          </li>
          <li>
            <NavLink
              className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm whitespace-nowrap"
              to="/admin/productlist"
              style={({ isActive }) => ({
                color: isActive ? "#0a7734" : "white",
              })}
            >
              Create Product
            </NavLink>
          </li>
          <li>
            <NavLink
              className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm whitespace-nowrap"
              to="/admin/allproductslist"
              style={({ isActive }) => ({
                color: isActive ? "#0a7734" : "white",
              })}
            >
              All Products
            </NavLink>
          </li>
          <li>
            <NavLink
              className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm whitespace-nowrap"
              to="/admin/userlist"
              style={({ isActive }) => ({
                color: isActive ? "#0a7734" : "white",
              })}
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink
              className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm whitespace-nowrap"
              to="/admin/orderlist"
              style={({ isActive }) => ({
                color: isActive ? "#0a7734" : "white",
              })}
            >
              Manage Orders
            </NavLink>
          </li>
        </>
      )}
      <li>
        <NavLink
          className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm whitespace-nowrap"
          to="/profile"
          style={({ isActive }) => ({
            color: isActive ? "#0a7734" : "white",
          })}
        >
          Profile
        </NavLink>
      </li>
      <li>
        <button
          className="list-item py-2 px-3 mb-2 hover:bg-[#2E2D2D] rounded-sm text-white whitespace-nowrap"
          onClick={logoutHandler}>Logout</button>
      </li>
    </ul>
  );
};

export default AdminMenu;
