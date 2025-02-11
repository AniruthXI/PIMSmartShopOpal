import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CheckCircle2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogTitle
} from '../../components/alert-dialog.jsx';

const AddToCartButton = ({ product, qty, dispatch, addToCart, navigate }) => {
    const [showAlert, setShowAlert] = useState(false);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty }));
        setShowAlert(true);
    };

    const handleConfirm = () => {
        setShowAlert(false);
        navigate('/cart');
    };

    return (
        <>
            <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
                <FaShoppingCart />
                <span>เพิ่มลงตะกร้า</span>
            </button>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent className="max-w-md bg-white rounded-lg">
                    <AlertDialogHeader>
                        <div className="flex flex-col items-center p-4">
                            <div className="rounded-full bg-green-100 p-3 mb-4">
                                <CheckCircle2 className="w-16 h-16 text-green-500 stroke-2" />
                            </div>
                            <h2 className="text-2xl font-semibold text-center mb-2">
                                เพิ่มสินค้าลงตะกร้าสำเร็จ!
                            </h2>
                            <div className="w-full bg-gray-50 p-4 rounded-lg">
                                <div className="text-center text-gray-600">
                                    เพิ่ม "{product.name}" ลงในตะกร้าแล้ว
                                </div>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction 
                            variant="default" 
                            className="w-full sm:w-32 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={handleConfirm}
                        >
                            ไปที่ตะกร้าสินค้า
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AddToCartButton;