// components/Sidebar.tsx
import React from "react";
import { useSideNavState } from "@/Contexts/SideNavStateContext";
import { Button } from "@heroui/react";
import { ArrowRightIcon } from "./icons";
import NavItems from "./NavItems";
import { AnimationOptions } from "@/Utils/types";

const Sidebar: React.FC = () => {
    const minSideNavWidth = 3.8;
    const maxSideNavWidth = 15;
    const animationOptions: AnimationOptions = {
        delay: 200,
        duration: 100,
    };

    const { sideNavState, toggleSideNavState } = useSideNavState();

    return (
        <aside
            className={`
                flex-shrink-0
                transition-all
                delay-[${animationOptions.delay}ms]
                duration-[${animationOptions.duration}ms]
                overflow-hidden
                p-2 
                overflow-y-auto
            `}
            style={{
                width:
                    sideNavState === "collapse"
                        ? `${minSideNavWidth}rem`
                        : `${maxSideNavWidth}rem`,
            }}
        >
            <div className="text-right">
                <Button
                    size="sm"
                    radius="lg"
                    color="primary"
                    variant="light"
                    isIconOnly
                    onPress={toggleSideNavState}
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
