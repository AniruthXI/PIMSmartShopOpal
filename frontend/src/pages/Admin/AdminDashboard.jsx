import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useGetUsersQuery } from '../../redux/api/usersApiSlice';
import {useGetTotalOrdersQuery, useGetTotalSalesQuery, useGetTotalSalesByDateQuery } from '../../redux/api/orderApiSlice';
import AdminMenu from './AdminMenu';
import OrderList from './OrderList';
import Loader from '../../components/Loader';
import InfoCard from './InfoCard'; // แยกการ์ดข้อมูลออกเป็นคอมโพเนนต์ย่อย

const AdminDashboard = () => {
    const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
    const { data: customers, isLoading: customersLoading } = useGetUsersQuery();
    const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
    const { data: salesDetail } = useGetTotalSalesByDateQuery();

    const [state, setState] = useState({
        options: {
            chart: { type: 'line' },
            tooltip: { theme: 'dark' },
            colors: ['#00E396'],
            dataLabels: { enabled: true },
            stroke: { curve: 'smooth' },
            title: { text: 'Sales Trend', align: 'left' },
            grid: { borderColor: '#ccc' },
            markers: { size: 1 },
            xaxis: { categories: [], title: { text: 'Date' } },
            yaxis: { title: { text: 'Sales' }, min: 0 },
            legend: { position: 'top', horizontalAlign: 'right', floating: true, offsetY: -25, offsetX: -5 },
        },
        series: [{ name: 'Sales', data: [] }],
    });

    useEffect(() => {
        if (salesDetail) {
            const formattedSalesDate = salesDetail.map((item) => ({
                x: item._id,
                y: item.totalSales,
            }));

            setState((prevState) => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: formattedSalesDate.map((item) => item.x),
                    },
                },
                series: [{ name: 'Sales', data: formattedSalesDate.map((item) => item.y) }],
            }));
        }
    }, [salesDetail]);

    return (
        <>
            <section className="xl:ml-[4rem] md:ml-[0rem]">
                <div className="w-[80%] flex justify-around flex-wrap">
                    <InfoCard
                        icon="💰"
                        title="Sales"
                        value={salesLoading ? <Loader /> : `฿ ${sales?.totalSales?.toFixed(2)}`}
                        bgColor="bg-green-500"
                    />
                    <InfoCard
                        icon="👥"
                        title="Customers"
                        value={customersLoading ? <Loader /> : customers?.length}
                        bgColor="bg-blue-500"
                    />
                    <InfoCard
                        icon="📦"
                        title="All Orders"
                        value={ordersLoading ? <Loader /> : orders?.totalOrders}
                        bgColor="bg-purple-500"
                    />
                </div>
                <div className="ml-[10rem] mt-[4rem]">
                    <Chart options={state.options} series={state.series} type="line" width="70%" />
                </div>
                <div className="mt-[4rem]">
                    <OrderList />
                </div>
            </section>
        </>
    );
};

export default AdminDashboard;