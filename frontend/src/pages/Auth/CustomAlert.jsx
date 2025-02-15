import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/alert-dialog.jsx";
import { CheckCircle2, XCircle } from "lucide-react";

const CustomAlert = ({ isOpen, onClose, type, message }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-white rounded-lg">
        <AlertDialogHeader>
          <div className="flex flex-col items-center p-4">
            <div className={`rounded-full ${type === 'success' ? 'bg-green-100' : 'bg-red-100'} p-3 mb-4`}>
              {type === 'success' ? (
                <CheckCircle2 className="w-16 h-16 text-green-500 stroke-2" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 stroke-2" />
              )}
            </div>
            
            <h2 className="text-2xl font-semibold text-center mb-2">
              {type === 'success' ? 'ดำเนินการสำเร็จ!' : 'เกิดข้อผิดพลาด!'}
            </h2>
            
            <div className="w-full bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-center items-center">
                <span className={`font-medium ${type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </span>
              </div>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction
            variant="default"
            className={`w-full sm:w-32 ${
              type === 'success' 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
            onClick={onClose}
          >
            ตกลง
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;