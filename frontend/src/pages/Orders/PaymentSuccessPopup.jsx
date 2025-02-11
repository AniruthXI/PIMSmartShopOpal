import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,AlertDialogAction,AlertDialogTitle } from '../../components/alert-dialog.jsx';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccessPopup = ({ isOpen, onClose, orderNumber, totalAmount, email }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white rounded-lg">
        <AlertDialogHeader>
          <div className="flex flex-col items-center p-4">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 stroke-2" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-2">
              การชำระเงินสำเร็จ!
            </h2>
            <p className="text-gray-600 text-center mb-4">
              ขอบคุณสำหรับการสั่งซื้อ เราได้ส่งอีเมลยืนยันการสั่งซื้อไปที่
            </p>
            <p className="text-blue-600 font-medium mb-4">{email}</p>
            
            <div className="w-full bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">หมายเลขคำสั่งซื้อ:</span>
                <span className="font-semibold">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ยอดรวมทั้งสิ้น:</span>
                <span className="font-semibold text-green-600">฿{totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction 
            variant="default" 
            className="w-full sm:w-32 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onClose}
          >
            ตกลง
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentSuccessPopup;