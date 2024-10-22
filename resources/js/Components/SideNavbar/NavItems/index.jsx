import React from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { usePage, router } from "@inertiajs/react";
import { items } from "./items";

const NavItems = ({ sideNavState }) => {
    const { url } = usePage();

    return (
        <div className="flex flex-col gap-2 items-center w-full py-3">
            {items.map((item) => (
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
                        size="lg"
                        radius="lg"
                        variant={url.startsWith(item.url) ? "flat" : "light"}
                        color={"primary"}
                        startContent={item.icon(26, 26)}
                        isIconOnly={sideNavState === "collapse" ? true : false}
                        className={`${
                            sideNavState !== "collapse" &&
                            "justify-start w-auto"
                        } text-foreground gap-5 w-full transition-all delay-200 duration-300`}
                        disabled={url.startsWith(item.url)}
                        onClick={() => router.visit(item.url)}
                    >
                        {
                            <p
                                className={`${
                                    sideNavState !== "collapse" &&
                                    "w-auto opacity-100"
                                } text-md w-0 opacity-0 transition-all delay-300 duration-150 `}
                            >
                                {item.label}
                            </p>
                        }
                    </Button>
                </Tooltip>
            ))}
        </div>
    );
};

export default NavItems;
