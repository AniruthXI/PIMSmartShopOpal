/* eslint-disable no-unused-vars */
import React from 'react';
import { Check, Mail } from 'lucide-react';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="rounded-full bg-green-100 p-3 w-fit mx-auto mb-6">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ขอบคุณที่ใช้บริการ
        </h1>
        
        <p className="text-gray-600 mb-6">
          การสั่งซื้อของคุณสำเร็จแล้ว เราได้ส่งรายละเอียดการสั่งซื้อไปยังอีเมลของคุณแล้ว
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
          <Mail className="w-5 h-5" />
          <span>กรุณาตรวจสอบอีเมลของคุณ</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">หมายเลขคำสั่งซื้อ</h2>
          <p className="text-gray-600">#ORDER12345</p>
        </div>

        <button onClick={() => window.location.href = '/'} 
                className="w-full bg-green-500 text-white rounded-lg py-3 hover:bg-green-600 transition-colors">
          กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;