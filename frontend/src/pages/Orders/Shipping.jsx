import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("");

  // Default address for pick up at store
  const defaultStoreAddress = {
    address: "สถาบันการจัดการปัญญาภิวัฒน์ อาคาร ConventionHall 85 ถ. แจ้งวัฒนะ ตำบลบางตลาด อ.ปากเกร็ด",
    city: "นนทบุรี",
    postalCode: "11120",
    country: "ประเทศไทย",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (deliveryOption === "store") {
      setAddress(defaultStoreAddress.address);
      setCity(defaultStoreAddress.city);
      setPostalCode(defaultStoreAddress.postalCode);
      setCountry(defaultStoreAddress.country);
    } else {
      setAddress(shippingAddress.address || "");
      setCity(shippingAddress.city || "");
      setPostalCode(shippingAddress.postalCode || "");
      setCountry(shippingAddress.country || "");
    }
  }, [deliveryOption, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address && deliveryOption === "shipping") {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress, deliveryOption]);

  return (
    <div className="container mx-auto mt-10">
      <ProgressSteps step1 step2 />
      <div className="mt-[10rem] flex justify-around items-center flex-wrap">
        <form onSubmit={submitHandler} className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
          <div className="mb-4">
            <label className="block text-black mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
              disabled={deliveryOption === "store"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              disabled={deliveryOption === "store"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={deliveryOption === "store"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Country</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
              disabled={deliveryOption === "store"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Delivery Option</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-500"
                  name="deliveryOption"
                  value="store"
                  checked={deliveryOption === "store"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
                <span className="ml-2">Pick up at store</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-500"
                  name="deliveryOption"
                  value="shipping"
                  checked={deliveryOption === "shipping"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
                <span className="ml-2">Ship to address</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Select Method</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span className="ml-2">PayPal or Credit Card</span>
              </label>
            </div>
          </div>
          <button
            className="bg-green-500 text-black py-2 px-4 rounded-full text-lg w-full"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
