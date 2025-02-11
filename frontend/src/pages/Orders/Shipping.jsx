import React, { useEffect, useState } from "react";
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

  const defaultStoreAddress = {
    address: "รับที่ร้าน PIM SmartShop อาคาร ConventionHall",
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
      setAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
    }
  }, [defaultStoreAddress, deliveryOption, shippingAddress]);
  
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="px-6 py-8">
          <ProgressSteps step1 step2 />
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">ที่อยู่ในการจัดส่ง</h1>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="กรอกที่อยู่"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={deliveryOption === "store"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">จังหวัด</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="กรอกจังหวัด"
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                    disabled={deliveryOption === "store"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="กรอกรหัสไปรษณีย์"
                    value={postalCode}
                    required
                    onChange={(e) => setPostalCode(e.target.value)}
                    disabled={deliveryOption === "store"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ประเทศ</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="กรอกประเทศ"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={deliveryOption === "store"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ตัวเลือกในการรับสินค้า</label>
                  <div className="flex space-x-4 text-black">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-green-500"
                        name="deliveryOption"
                        value="store"
                        checked={deliveryOption === "store"}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                      />
                      <span className="ml-2">รับที่ร้าน</span>
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
                      <span className="ml-2">จัดส่งที่บ้าน</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เลือกวิธีชำระเงิน</label>
                  <div className="flex text-black">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-green-500"
                        name="paymentMethod"
                        value="PayPal"
                        checked={paymentMethod === "PayPal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="ml-2">QR CODE</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-300 ease-in-out shadow-md"
              type="submit"
            >
              ดำเนินการต่อ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;