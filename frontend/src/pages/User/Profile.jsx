import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile] = useProfileMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        setUserName(userInfo.username);
        setEmail(userInfo.email);
    }, [userInfo.email, userInfo.username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await updateProfile({
                _id: userInfo._id,
                username,
                email,
                password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4 mt-10">
            <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="p-4">
                    <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                className="form-input p-3 w-full border rounded-lg focus:outline-none focus:border-gray-300 text-black"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="form-input p-3 w-full border rounded-lg focus:outline-none focus:border-gray-300 text-black"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="form-input p-3 w-full border rounded-lg focus:outline-none focus:border-gray-300 text-black"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="form-input p-3 w-full border rounded-lg focus:outline-none focus:border-gray-300 text-black"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none text-black"
                                disabled={loading}
                            >
                                {loading ? <Loader /> : "Update"}
                            </button>

                            <Link
                                to="/user-orders"
                                className="py-2 px-4 bg-black text-white rounded hover:bg-gray-800 focus:outline-none"
                            >
                                My Orders
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
