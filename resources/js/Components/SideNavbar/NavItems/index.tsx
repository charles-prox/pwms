import React from "react";
import { Button, Divider, Tooltip } from "@heroui/react";
import { usePage, router } from "@inertiajs/react";
import { AnimationOptions, SideNavState } from "@/Utils/types";
import clsx from "clsx";
import { filterNavItems } from "@/Utils/helpers";
import { navItems } from "./items";

type NavItemsProps = {
    sideNavState: SideNavState;
    animationOptions: AnimationOptions;
};

const NavItems: React.FC<NavItemsProps> = ({
    sideNavState,
    animationOptions,
}) => {
    const { auth } = usePage<any>().props;
    const { url } = usePage<{ url: string }>();

    const visibleItems = filterNavItems(navItems, auth.user);
    console.log("visibleItems: ", visibleItems);
    console.log(url);

    return (
        <div className="flex flex-col gap-2 items-start w-full py-3">
            {visibleItems.map((item) => {
                if (item.type === "link") {
                    const isActive =
                        item.url === "/"
                            ? url === "/"
                            : url.includes(item.url || "");

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
                                variant={isActive ? "flat" : "light"}
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
                                onPress={() => {
                                    console.log(`Navigating to ${item.url}`);

                                    router.visit(item.url ? item.url : "");
                                }}
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
                }

                if (item.type === "title") {
                    return (
                        <div
                            key={item.key}
                            className="w-full flex items-center gap-2 px-2"
                        >
                            {sideNavState !== "collapse" && (
                                <p className="text-default-400 text-sm">
                                    {item.label}
                                </p>
                            )}
                            <div className="flex-grow">
                                <Divider className="mt-2" />
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};

export default NavItems;
