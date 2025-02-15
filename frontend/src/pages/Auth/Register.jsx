import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import CustomAlert from "./CustomAlert";
import logoSmartShop from "../../public/images/logoSmartShop.jpg";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // แยก useEffect สำหรับการ redirect
  useEffect(() => {
    if (shouldRedirect && userInfo) {
      navigate(redirect);
    }
  }, [shouldRedirect, userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlert({
        show: true,
        type: 'error',
        message: 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง'
      });
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      // เก็บ credentials ไว้แต่ยังไม่ redirect
      dispatch(setCredentials({ ...res }));
      setAlert({
        show: true,
        type: 'success',
        message: 'ลงทะเบียนสำเร็จ'
      });
    } catch (err) {
      console.log('Registration error:', err);
      setAlert({
        show: true,
        type: 'error',
        message: err.data?.error || 'เกิดข้อผิดพลาดในการลงทะเบียน'
      });
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, show: false });
    if (alert.type === 'success') {
      setShouldRedirect(true);
    }
  };


  return (
    <section className="pl-[10rem] flex flex-wrap">
      <CustomAlert
        isOpen={alert.show}
        onClose={handleAlertClose}
        type={alert.type}
        message={alert.message}
      />
      
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <form onSubmit={submitHandler} className="container w-[40rem]">
          <div className="my-[2rem]">
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full text-black"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full text-black"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full text-black"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full text-black"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-green-500 text-black px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-20">
          <p className="text-black">
            Already have an account?{" > "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-green-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src={logoSmartShop}
        alt=""
        className="h-[30rem] w-[50%] py-10 my-[5rem] xl:block md:hidden sm:hidden rounded-lg"
      />
    </section>
  );
};

export default Register;