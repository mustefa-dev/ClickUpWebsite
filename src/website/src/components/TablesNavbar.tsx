import React from 'react';

const TablesNavbar: React.FC = () => {
    return (
        <div className="flex flex-row justify-center items-center p-0 gap-[442px] w-[1066px] h-[44px]">
            {/* Table Head */}
            <div className="flex flex-row items-start p-0 w-[1074px] h-[52px] rounded-t-lg bg-gray-200">
                <div className="flex-1 text-center">Column 1</div>
                <div className="flex-1 text-center">Column 2</div>
                <div className="flex-1 text-center">Column 3</div>
                <div className="flex-1 text-center">Column 4</div>
            </div>

            {/* Table Row */}
            <div className="flex flex-row items-start p-0 w-[1074px] h-[66px] bg-gray-100">
                <div className="flex-1 text-center">Row 1, Cell 1</div>
                <div className="flex-1 text-center">Row 1, Cell 2</div>
                <div className="flex-1 text-center">Row 1, Cell 3</div>
                <div className="flex-1 text-center">Row 1, Cell 4</div>
            </div>

            {/* Page Number */}
            <div className="flex flex-row items-center p-0 pr-6 gap-4 w-[556px] h-[48px] bg-gray-300">
                <div className="px-3 py-1 bg-blue-500 text-white rounded-full cursor-pointer">1</div>
                <div className="px-3 py-1 bg-white text-black rounded-full cursor-pointer">2</div>
                <div className="px-3 py-1 bg-white text-black rounded-full cursor-pointer">3</div>
                <div className="px-3 py-1 bg-white text-black rounded-full cursor-pointer">4</div>
            </div>
        </div>
    );
};

export default TablesNavbar;
