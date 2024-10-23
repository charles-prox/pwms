// components/Sidebar.tsx
import React from "react";

const Sidebar: React.FC = () => {
    return (
        <aside className="w-16 flex-shrink-0">
            <nav className="mt-10">
                <a
                    href="#"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Dashboard
                </a>
                <a
                    href="#"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Profile
                </a>
                <a
                    href="#"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Settings
                </a>
                <a
                    href="#"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Help
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;
