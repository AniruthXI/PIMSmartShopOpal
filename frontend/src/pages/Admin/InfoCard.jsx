// src/pages/Admin/InfoCard.jsx
import React from 'react';

const InfoCard = ({ icon, title, value, bgColor }) => {
    return (
        <div className="rounded-lg bg-white p-5 w-[20rem] mt-5 border border-black">
            <div className={`font-bold rounded-full w-[3rem] ${bgColor} text-center p-3`}>
                {icon}
            </div>
            <p className="mt-5">{title}</p>
            <h1 className="text-xl font-bold">{value}</h1>
        </div>
    );
};

export default InfoCard;