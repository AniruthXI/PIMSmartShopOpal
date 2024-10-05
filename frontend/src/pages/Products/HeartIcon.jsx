/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
    addToFavorites,
    removeFromFavorites,
    setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
    addFavoriteToLocalStorage,
    getFavoritesFromLocalStorage,
    removeFavoriteFromLocalStorage,
} from "../../utils/localStorage";

const HeartIcon = ({ product }) => {
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites) || [];
    const isFavorite = favorites.some((p) => p._id === product._id);

    useEffect(() => {
        const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
        dispatch(setFavorites(favoritesFromLocalStorage));
    }, []);

    const toggleFavorites = () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(product));
            // remove the product from the localStorage as well
            removeFavoriteFromLocalStorage(product._id);
        } else {
            dispatch(addToFavorites(product));
            // add the product to localStorage as well
            addFavoriteToLocalStorage(product);
        }
    };

    return (
        <div
            className="absolute top-2 right-2 cursor-pointer"
            onClick={toggleFavorites}
        >
            {isFavorite ? (
                <FaHeart className="text-green-500" />
            ) : (
                <FaRegHeart className="text-green-500" />
            )}
        </div>
    );
};

export default HeartIcon;
