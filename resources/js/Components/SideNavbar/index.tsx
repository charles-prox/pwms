// components/Sidebar.tsx
import React from "react";
import { useSideNavState } from "@/Contexts/SideNavStateContext";
import { Button } from "@heroui/react";
import { ArrowRightIcon } from "./icons";
import NavItems from "./NavItems";
import { AnimationOptions } from "@/Utils/types";

const Sidebar: React.FC = () => {
    const minSideNavWidth = 16;
    const maxSideNavWidth = 60;
    const animationOptions: AnimationOptions = {
        delay: 200,
        duration: 100,
    };

    const { sideNavState, toggleSideNavState } = useSideNavState();

    return (
        <aside
            className={`
                ${
                    sideNavState === "collapse"
                        ? `w-${minSideNavWidth}`
                        : `w-${maxSideNavWidth}`
                } 
                flex-shrink-0
                transition-width 
                delay-${animationOptions.delay} 
                duration-${animationOptions.duration}
                overflow-hidden
                p-2 
            `}
        >
            <div className="text-right">
                <Button
                    size="sm"
                    radius="lg"
                    color="primary"
                    variant="light"
                    isIconOnly
                    onClick={toggleSideNavState}
                >
                    <ArrowRightIcon
                        className={`
                            ${sideNavState !== "collapse" && "-rotate-180"} 
                            transition-all 
                            transform
                        `}
                        width={20}
                        height={20}
                    />
                </Button>
            </div>
            <nav>
                <NavItems
                    sideNavState={sideNavState}
                    animationOptions={animationOptions}
                />
            </nav>
        </aside>
    );
};

export default Sidebar;
