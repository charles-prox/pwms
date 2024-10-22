import React, { useMemo } from "react";
import { usePage, useForm, Link } from "@inertiajs/react";
import { asset, url } from "@/utils/helpers";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    User,
    Image,
    Button,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Navbar,
    Spacer,
    Divider,
} from "@nextui-org/react";
import { useTheme } from "@/ThemeProvider";
import {
    BellIcon,
    CaretDownIcon,
    LogoutIcon,
    MoonIcon,
    SecurityIcon,
    SunIcon,
    UserIcon,
    UserIdIcon,
} from "./icons";
import { appName } from "@/utils/constants";

const Logo = () => {
    return useMemo(
        () => (
            <Image
                width={40}
                alt="App logo"
                src={asset("logo.png") || "../logo.png"}
                loading="lazy"
                removeWrapper
            />
        ),
        []
    );
};

const ThemeToggleIcon = () => {
    const theme = useTheme().theme;

    return useMemo(
        () => (theme === "light" ? <MoonIcon /> : <SunIcon />),
        [theme]
    );
};

const AppNavbar = () => {
    const { auth } = usePage().props;
    const { post } = useForm();
    const { theme, toggleTheme } = useTheme();

    const submit = (e) => {
        e.preventDefault();
        post(route("logout"), { replace: true });
    };

    return useMemo(
        () => (
            <Navbar
                maxWidth={"full"}
                classNames={{
                    wrapper: `px-6 ${
                        theme === "light" && "bg-custom-gradient"
                    }`,
                }}
            >
                <NavbarBrand>
                    {/* Change this section into your logo */}
                    <Logo />
                    <Spacer x="2" />
                    <div className="hidden sm:flex text-xl font-bold ">
                        {appName}
                    </div>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onClick={() => toggleTheme()}
                    >
                        <ThemeToggleIcon />
                    </Button>
                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onClick={() => toggleTheme()}
                    >
                        <BellIcon />
                    </Button>
                    <Divider orientation="vertical" className={"h-5"} />
                    {auth.user && (
                        <NavbarItem>
                            <Dropdown
                                showArrow
                                classNames={{
                                    content: `${theme} text-foreground`,
                                }}
                            >
                                <DropdownTrigger>
                                    <Button
                                        disableAnimation
                                        className="inline-flex items-center rounded-md bg-transparent"
                                    >
                                        <User
                                            name={`${
                                                auth?.user?.first_name
                                            } ${auth?.user.middle_name
                                                .charAt(0)
                                                .toUpperCase()}. ${
                                                auth?.user.last_name
                                            }`}
                                            description={auth?.user?.position}
                                            avatarProps={{
                                                showFallback: true,
                                                src: auth?.user
                                                    .profile_photo_path
                                                    ? url(
                                                          auth?.user
                                                              .profile_photo_path
                                                      )
                                                    : auth?.user
                                                          .profile_photo_url,
                                                fallback: <UserIcon />,
                                            }}
                                        />
                                        <CaretDownIcon />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem
                                        key="profile"
                                        as={Link}
                                        href={route("account.profile")}
                                        startContent={<UserIdIcon />}
                                        description="Update personal information and photo"
                                    >
                                        Profile
                                    </DropdownItem>
                                    <DropdownItem
                                        key="security"
                                        as={Link}
                                        href={route("account.security")}
                                        startContent={<SecurityIcon />}
                                        description="Update password and two-factor auth"
                                    >
                                        Account Security
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        onClick={(e) => submit(e)}
                                        startContent={<LogoutIcon />}
                                    >
                                        Log out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    )}
                </NavbarContent>
            </Navbar>
        ),
        [auth, toggleTheme, theme]
    );
};

export default AppNavbar;
