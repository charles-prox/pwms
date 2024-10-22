import React from "react";
import { Button } from "@nextui-org/react";
import NavItems from "./NavItems";
import { useSideNavState } from "@/SideNavStateProvider";
import { ArrowRightIcon } from "./icons";

const SideNavbar = ({ minSideNavWidth, maxSideNavWidth, animationOptions }) => {
    const { sideNavState, toggleSideNavState } = useSideNavState();

    return (
        <div
            className={`
                flex-none 
                ${
                    sideNavState === "collapse"
                        ? `w-${minSideNavWidth}`
                        : `w-${maxSideNavWidth}`
                } 
                rounded-none 
                p-2 
                border-default-400/30
                transition-all 
                delay-${animationOptions.delay} 
                duration-${animationOptions.duration} 
                overflow-hidden
                h-[calc(100vh-4rem)]
                fixed
                left-0 top-[4rem]
                shadow-md
            `}
        >
            <div className="flex flex-col justify-between h-full">
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
                <div className="flex-grow">
                    <NavItems sideNavState={sideNavState} />
                </div>
            </div>
        </div>
    );
};

export default SideNavbar;
