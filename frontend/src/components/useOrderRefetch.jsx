import { useEffect } from 'react';
import { useGetOrderDetailsQuery } from '../../redux/api/orderApiSlice';

const useOrderRefetch = (orderId) => {
    const {
        data: order,
        isLoading,
        error,
        refetch
    } = useGetOrderDetailsQuery(orderId, {
        // เพิ่ม polling ทุก 5 วินาที
        pollingInterval: 5000,
    });

    // ทำ refetch เมื่อ orderId เปลี่ยน
    useEffect(() => {
        if (orderId) {
            refetch();
        }
    }, [orderId, refetch]);

    // สร้างฟังก์ชันสำหรับ refetch ข้อมูลแบบ manual
    const refreshOrder = async () => {
        try {
            await refetch();
        } catch (error) {
            console.error('Failed to refresh order:', error);
        }
    };

    return {
        order,
        isLoading,
        error,
        refreshOrder
    };
};

export default useOrderRefetch;