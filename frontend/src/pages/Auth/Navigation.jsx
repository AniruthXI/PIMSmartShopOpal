import { useState } from "react";
import { AiOutlineHome, AiOutlineShopping, AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import Logo from "../../pages/Auth/pimlogo.png"; // Import the logo image
import AdminMenu from "../Admin/AdminMenu"

const Navigation = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`p-4 bg-green-800 text-white flex items-center justify-between ${mobileMenuOpen ? "pb-48 md:pb-36" : ""}`}>
            <div className="flex items-center justify-stretch space-x-4">
                <Link to="/" className="flex items-center">
                    <img src={Logo} alt="Logo" className="max-h-14 mr-2" />
                </Link>
                <div className="hidden md:flex space-x-4">
                    <Link to="/" className="flex items-center">
                        <AiOutlineHome className="mr-2" size={26} />
                        <span>HOME</span>
                    </Link>
                    <Link to="/shop" className="flex items-center">
                        <AiOutlineShopping className="mr-2" size={26} />
                        <span>SHOP</span>
                    </Link>
                    <Link to="/cart" className="flex items-center">
                        <AiOutlineShoppingCart className="mr-2" size={26} />
                        <span>Cart</span>
                    </Link>
                    <Link to="/favorite" className="flex items-center">
                        <FaHeart className="mr-2" size={26} />
                        <span>Favourite</span>
                    </Link>
                </div>
                <div className="absolute md:hidden right-4 top-8">
                    <button onClick={toggleMobileMenu} className="ml-auto">
                        {mobileMenuOpen ? <AiOutlineClose size={26} /> : <AiOutlineMenu size={26} />}
                    </button>
                </div>
            </div>
            <div className="relative hidden md:block">
                {userInfo ? (
                    <div>
                        <button onClick={toggleDropdown} className="text-gray-8000 focus:outline-none flex items-center">
                            <span>{userInfo.username}</span>
                            <svg className={`h-4 w-4 ml-1 ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="white">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <AdminMenu userInfo={userInfo} logoutHandler={logoutHandler} />
                        )}
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-black focus:outline-none">LOGIN</Link>
                        <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-black focus:outline-none">REGISTER</Link>
                    </div>
                )}
            </div>
            {mobileMenuOpen && (
                <div className="absolute top-0 left-0 w-full bg-green-800 text-white p-4 md:hidden">
                    <div className="flex flex-col space-y-4">
                        <button onClick={toggleMobileMenu}>
                            {mobileMenuOpen ? <AiOutlineClose size={26} /> : <AiOutlineMenu size={26} />}
                        </button>
                        <Link to="/" className="flex items-center" onClick={toggleMobileMenu}>
                            <AiOutlineHome className="mr-2" size={26} />
                            <span>HOME</span>
                        </Link>
                        <Link to="/shop" className="flex items-center" onClick={toggleMobileMenu}>
                            <AiOutlineShopping className="mr-2" size={26} />
                            <span>SHOP</span>
                        </Link>
                        <Link to="/cart" className="flex items-center" onClick={toggleMobileMenu}>
                            <AiOutlineShoppingCart className="mr-2" size={26} />
                            <span>Cart</span>
                        </Link>
                        <Link to="/favorites" className="flex items-center" onClick={toggleMobileMenu}>
                            <FaHeart className="mr-2" size={26} />
                            <span>Favorites</span>
                        </Link>
                    </div>
                    <div className="mt-4">
                        {userInfo ? (
                            <div>
                                <button onClick={toggleDropdown} className="text-gray-8000 focus:outline-none flex items-center">
                                    <span>{userInfo.username}</span>
                                    <svg className={`h-4 w-4 ml-1 ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="white">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                                    </svg>
                                </button>
                                {dropdownOpen && (
                                    <AdminMenu userInfo={userInfo} logoutHandler={logoutHandler} />
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link to="/login" className="px-4 py-2 bg-black text-white rounded-md hover:bg-green-500 focus:outline-none">LOGIN</Link>
                                <Link to="/register" className="px-4 py-2 bg-black text-white rounded-md hover:bg-green-500 focus:outline-none">REGISTER</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navigation;
