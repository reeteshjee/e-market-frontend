import React, { useState, useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Hide toast after 3 seconds

        return () => clearTimeout(timer); // Clean up timer on unmount
    }, [message, onClose]);

    return (
        <div
            className={`fixed bottom-4 left-1/2 z-60 transform -translate-x-1/2 w-80 p-4 rounded-md text-white shadow-lg transition-all ${type === "success"
                ? "bg-green-500"
                : type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
        >
            {message}
        </div>
    );
};

export default Toast;
