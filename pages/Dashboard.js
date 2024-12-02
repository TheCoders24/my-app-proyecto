"use client";

const { requestToBodyStream } = require("next/dist/server/body-streams");
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';



const DashboardPage = () => {
    return(
    <div className="h-screen flex justify-center items-center">
        <h1>Dashboard</h1>
    </div>
    );
};

export default DashboardPage;   