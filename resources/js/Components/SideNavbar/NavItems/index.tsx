import React from "react";
import { Button, Divider, Tooltip } from "@nextui-org/react";
import { usePage, router } from "@inertiajs/react";
import { items } from "./items";
import { AnimationOptions, NavItem, SideNavState } from "@/Utils/types";

// Define the props for the NavItems component
type NavItemsProps = {
    sideNavState: SideNavState;
    animationOptions: AnimationOptions;
};

const NavItems: React.FC<NavItemsProps> = ({
    sideNavState,
    animationOptions,
}) => {
    const { url } = usePage<{ url: string }>();

    return (
        <div className="flex flex-col gap-2 items-start w-full py-3">
            {items.map((item: NavItem) => {
                if (item.type === "link") {
                    return (
                        <Tooltip
                            key={item.key}
                            isDisabled={sideNavState !== "collapse"}
                            showArrow={true}
                            content={item.label}
                            placement="right"
                            size="md"
                            color="default"
                            radius="sm"
                            classNames={{ content: "text-foreground" }}
                        >
                            <Button
                                fullWidth
                                size="md"
                                radius="sm"
                                variant={url === item.url ? "flat" : "light"}
                                color={"primary"}
                                startContent={item.icon ? item.icon(20) : null}
                                isIconOnly={sideNavState === "collapse"}
                                className={`
                            ${sideNavState !== "collapse" && "w-auto"} 
                            text-foreground 
                            gap-5 
                            w-full 
                            transition-width 
                            delay-${animationOptions.delay} 
                            duration-${animationOptions.duration}
                            justify-start
                            px-3
                        `}
                                disabled={url === item.url}
                                onClick={() =>
                                    router.visit(item.url ? item.url : "")
                                }
                            >
                                <p
                                    className={`
                                ${
                                    sideNavState !== "collapse"
                                        ? "block"
                                        : "hidden"
                                } 
                                text-md 
                                w-0 
                            `}
                                >
                                    {item.label}
                                </p>
                            </Button>
                        </Tooltip>
                    );
                } else if (item.type === "title") {
                    return (
                        <div
                            key={item.key}
                            className="w-full flex flex-row align- content-center flex-nowrap flex-1 gap-2 px-2"
                        >
                            {sideNavState !== "collapse" && (
                                <div>
                                    <p className="text-default-400 text-sm">
                                        {item.label}
                                    </p>
                                </div>
                            )}
                            <div className="flex-grow">
                                <Divider className="mt-2" />
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default NavItems;
