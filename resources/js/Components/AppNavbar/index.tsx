import React, { useMemo } from "react";
import { usePage, useForm, Link } from "@inertiajs/react";
import { asset, url } from "@/Utils/helpers";
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
} from "@heroui/react";
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
import { appName } from "@/Utils/constants";
import { useTheme } from "@/Contexts/ThemeContext";

// Type definitions for auth props (modify as per your auth structure)
interface AuthProps {
    user: {
        first_name: string;
        middle_name?: string;
        last_name: string;
        position: string;
        profile_photo_path?: string;
        profile_photo_url?: string;
    };
}

const Logo: React.FC = () => {
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

const ThemeToggleIcon: React.FC = () => {
    const theme = useTheme().theme;

    return useMemo(
        () => (theme === "light" ? <MoonIcon /> : <SunIcon />),
        [theme]
    );
};

const AppNavbar: React.FC = () => {
    const { auth } = usePage<any>().props;
    const { post } = useForm();
    const { theme, toggleTheme } = useTheme();

    const submit = () =>
        // e: React.MouseEvent<HTMLLIElement, globalThis.MouseEvent>
        {
            // e.preventDefault();
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
                    <Logo />
                    <Spacer x={2} />
                    <div className="hidden sm:flex text-xl font-bold ">
                        {appName}
                    </div>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onPress={() => toggleTheme()}
                    >
                        <ThemeToggleIcon />
                    </Button>
                    <Button
                        isIconOnly
                        variant="light"
                        radius="full"
                        onPress={() => toggleTheme()}
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
                                            name={`${auth.user.full_name} `}
                                            description={
                                                auth.user.position.name
                                            }
                                            avatarProps={{
                                                showFallback: true,
                                                src: auth.user
                                                    .profile_photo_path
                                                    ? url(
                                                          auth.user
                                                              .profile_photo_path
                                                      )
                                                    : auth.user
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
                                        onPress={(e: any) => submit()}
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
