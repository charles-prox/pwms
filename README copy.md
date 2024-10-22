# Authentication Template Guide

Please note that this guide provides a step-by-step process for setting up an authentication template project using Laravel Jetstream, Inertia, React, NextUI, and Spatie Laravel Permission. You may need to refer to the official documentation and make further customizations based on your specific requirements.

## Step 1: Setting Up the Project

1. **Install Laravel**:

    - Make sure you have Composer installed on your machine.
    - Create a new Laravel project:
        ```sh
        composer create-project --prefer-dist laravel/laravel auth-template
        ```

2. **Navigate to the Project Directory**:

    ```sh
    cd auth-template
    ```

3. **Install Laravel Jetstream**:

    - Install Jetstream with Inertia and React:
        ```sh
        composer require laravel/jetstream
        php artisan jetstream:install inertia --stack=react
        ```

4. **Install Dependencies**:

    - Install the necessary npm packages:
        ```sh
        npm install
        ```

5. **Install NextUI**:

    - Install NextUI and Framer Motion:
        ```sh
        npm install @nextui-org/react framer-motion
        ```

6. **Configure TailwindCSS for NextUI**:

    - Update `tailwind.config.js` to include NextUI's theme:

        ```js
        // tailwind.config.js
        const { nextui } = require("@nextui-org/react");

        /** @type {import('tailwindcss').Config} */
        module.exports = {
            content: [
                // ...
                "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
            ],
            theme: {
                extend: {},
            },
            darkMode: "class",
            plugins: [nextui()],
        };
        ```

7. **Remove Unnecessary Vue Files**:

    - Navigate to the `resources/js` folder and remove the Vue files, but retain the `Components`, `Layouts`, and `Pages` folders:
        ```sh
        rm -rf resources/js/*.vue
        ```
    - Inside the `Pages` folder, remove the `API` folder and all files within the `Auth` and `Profile` folders:
        ```sh
        rm -rf resources/js/Pages/API
        rm -rf resources/js/Pages/Auth/*
        rm -rf resources/js/Pages/Profile/*
        ```

8. **Run Migrations**:

    - Migrate the default tables:
        ```sh
        php artisan migrate
        ```

9. **Install Spatie Permission Package**:

    - Install the Spatie Laravel Permission package:
        ```sh
        composer require spatie/laravel-permission
        ```

10. **Publish Spatie Permission Configuration**:

    - Publish the configuration file for Spatie Permission:
        ```sh
        php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
        ```

11. **Run Spatie Permission Migrations**:

    - Run the migrations for Spatie Permission:
        ```sh
        php artisan migrate
        ```

12. **Update App Configuration**:

    - Add the service provider to `config/app.php`:
        ```php
        'providers' => [
            //...
            Spatie\Permission\PermissionServiceProvider::class,
        ],
        ```

13. **Commit Changes**:
    - After setting up the initial project, commit the changes:
        ```sh
        git add .
        git commit -m "Initial setup of Laravel project with Jetstream, Inertia, React, NextUI, and Spatie Permission; removed Vue files"
        ```

## Step 2: Integrate Spatie Laravel Permission

1. **Install Spatie Laravel Permission**:

    - Use Composer to install the package:
        ```sh
        composer require spatie/laravel-permission
        ```

2. **Register the Service Provider**:

    - Add the service provider to your `bootstrap/app.php` file:

        ```php
        // bootstrap/app.php

        $app->register(Spatie\Permission\PermissionServiceProvider::class);
        ```

3. **Publish the Configuration File**:

    - Publish the configuration file and the migration files:
        ```sh
        php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
        ```

4. **Run the Migrations**:

    - Migrate the new tables for roles and permissions:
        ```sh
        php artisan migrate
        ```

5. **Configure the Models**:

    - Add the `HasRoles` trait to your User model:

        ```php
        use Spatie\Permission\Traits\HasRoles;

        class User extends Authenticatable
        {
            use HasRoles;

            // rest of your model code
        }
        ```

6. **Seed Initial Roles and Permissions**:

    - Create and run a seeder for roles and permissions:
        ```sh
        php artisan make:seeder RolesAndPermissionsSeeder
        php artisan db:seed --class=RolesAndPermissionsSeeder
        ```

7. **Commit Changes**:
    - Commit your changes after integrating Spatie Laravel Permission:
        ```sh
        git add .
        git commit -m "Integrate Spatie Laravel Permission"
        ```

## Step 3: Transition to React in Jetstream

1.  **Update Blade Template**:

    -   Edit `resources/views/app.blade.php` to transition from Vue to React. Modify the line to:
        ```jsx
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        ```
    -   Here is the line to edit:

        ````jsx
        <!DOCTYPE html>
        <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
            <head>
                <!-- ... -->

                <!-- Scripts -->
                @routes
                @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"]) <!-- Edit this line -->
                @inertiaHead
            </head>
            <body class="font-sans antialiased">
                @inertia
            </body>

        </html>

             ```
        ````

2.  **Rename JavaScript Files**:

    -   Navigate to `resources/js` and rename `app.js` to `app.jsx`:
        ```sh
        mv resources/js/app.js resources/js/app.jsx
        ```

3.  **Create ThemeProvider Component**:

    -   Create a file named `ThemeProvider.jsx` in the `resources/js` folder with the following code:

        ```jsx
        import React, {
            useContext,
            createContext,
            useState,
            useCallback,
            useMemo,
            useEffect,
        } from "react";

        export const ThemeContext = createContext({});

        const ThemeProvider = ({ children }) => {
            const [theme, setTheme] = useState(() => {
                const initialTheme = localStorage.getItem("theme");
                return initialTheme || "light";
            });

            const toggleTheme = useCallback(() => {
                setTheme((prevTheme) => {
                    const newTheme = prevTheme === "light" ? "dark" : "light";
                    localStorage.setItem("theme", newTheme);
                    return newTheme;
                });
            }, []);

            const contextValue = useMemo(
                () => ({ theme, toggleTheme }),
                [theme, toggleTheme]
            );

            useEffect(() => {
                const savedTheme = localStorage.getItem("theme");
                if (savedTheme && savedTheme !== theme) {
                    setTheme(savedTheme);
                }
            }, []);

            return (
                <ThemeContext.Provider value={contextValue}>
                    {children}
                </ThemeContext.Provider>
            );
        };

        export const useTheme = () => {
            const value = useContext(ThemeContext);
            if (!value) {
                throw new Error("useTheme must be used within a ThemeProvider");
            }
            return value;
        };

        export default ThemeProvider;
        ```

4.  **Create SidebarViewStateProvider Component** (Optional):

    -   If your project includes a sidebar in the dashboard, you can create a file named `SidebarViewStateProvider.jsx` in the `resources/js` folder. This component manages the state of the sidebar (expand/collapse) and persists the state in `localStorage`.
    -   Here is the code for `SidebarViewStateProvider.jsx`:

        ```jsx
        import React, {
            createContext,
            useState,
            useContext,
            useEffect,
            useCallback,
        } from "react";

        const SidebarViewStateContext = createContext();

        export const useSidebarViewState = () =>
            useContext(SidebarViewStateContext);

        export const SidebarViewStateProvider = ({ children }) => {
            const [sidebarView, setSidebarView] = useState(() => {
                return localStorage.getItem("sidebarview") || "expand";
            });

            const toggleSidebarView = useCallback(() => {
                const newSidebarView =
                    sidebarView === "expand" ? "collapse" : "expand";
                setSidebarView(newSidebarView);
                localStorage.setItem("sidebarview", newSidebarView);
            }, [sidebarView]);

            useEffect(() => {
                const savedSidebarView = localStorage.getItem("sidebarview");
                if (savedSidebarView) {
                    setSidebarView(savedSidebarView);
                }
            }, []);

            return (
                <SidebarViewStateContext.Provider
                    value={{ sidebarView, toggleSidebarView }}
                >
                    {children}
                </SidebarViewStateContext.Provider>
            );
        };
        ```

5.  **Rename and Update App Layout**:

    -   Go to `resources/js/Layouts` and rename `AppLayout.vue` to `AppLayout.jsx`:
        ```sh
        mv resources/js/Layouts/AppLayout.vue resources/js/Layouts/AppLayout.jsx
        ```
    -   Update the code inside `AppLayout.jsx` to:

        ```jsx
        import React from "react";

        import { usePage } from "@inertiajs/react";
        import AppNavbar from "@/Components/AppNavbar";
        import SidebarNav from "@/Components/SidebarNav";
        import { useTheme } from "@/ThemeProvider";
        import { useSidebarViewState } from "@/SidebarViewStateProvider";
        import { Spacer } from "@nextui-org/react";

        const AppLayout = ({ children }) => {
            const { component } = usePage();
            const { sidebarView } = useSidebarViewState();
            const theme = useTheme().theme;

            switch (component.startsWith("Auth/")) {
                // if the component is in login, use LoginLayout
                case true:
                    return <main>{children}</main>;

                default:
                    return (
                        <main
                            className={`${theme} text-foreground bg-background flex flex-col h-screen `}
                        >
                            <AppNavbar />
                            <div
                                className={`flex flex-grow overflow-auto bg-slate-300/10`}
                            >
                                {/* Side Navbar */}
                                <SidebarNav />
                                <Spacer
                                    x={sidebarView === "collapse" ? 16 : 52}
                                    className="transition-all delay-150 duration-100"
                                />
                                <div
                                    className={`
                                            flex-grow p-10 overflow-y-auto  bg-slate-400/10
                                           `}
                                >
                                    {children}
                                </div>
                            </div>
                        </main>
                    );
            }
        };

        export default AppLayout;
        ```

## Step 4 Create an `AppNavbar` Component

1. **Create an `AppNavbar` folder** in `resources/js/Components`:

    ```bash
    mkdir -p resources/js/Components/AppNavbar
    ```

2. **Create an `index.jsx` file** inside the `AppNavbar` folder with the following content:

    ```jsx
    // resources/js/Components/AppNavbar/index.jsx

    import { Navbar, Button, Link } from "@nextui-org/react";
    import { SunIcon, MoonIcon, LogoutIcon, UserIdIcon } from "../icons";
    import { useTheme } from "next-themes";
    import { Inertia } from "@inertiajs/inertia";

    const AppNavbar = () => {
        const { theme, setTheme } = useTheme();

        const handleLogout = () => {
            Inertia.post("/logout");
        };

        return (
            <Navbar isBordered variant="sticky">
                <Navbar.Brand>
                    <Navbar.Toggle aria-label="toggle navigation" />
                    <Text b color="inherit" hideIn="xs">
                        MyApp
                    </Text>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs" variant="highlight-rounded">
                    <Navbar.Link isActive href="#">
                        Dashboard
                    </Navbar.Link>
                    <Navbar.Link href="#">Profile</Navbar.Link>
                    <Navbar.Link href="#">Settings</Navbar.Link>
                </Navbar.Content>
                <Navbar.Content>
                    <Navbar.Item>
                        <Button auto flat as={Link} href="#">
                            Sign Up
                        </Button>
                    </Navbar.Item>
                    <Button auto flat onClick={handleLogout}>
                        <LogoutIcon />
                    </Button>
                    <Button
                        auto
                        flat
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                    >
                        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    </Button>
                    <Button auto flat as={Link} href="#">
                        <UserIdIcon />
                    </Button>
                </Navbar.Content>
            </Navbar>
        );
    };

    export default AppNavbar;
    ```

3. **Import and use the `AppNavbar` component** in your main layout or wherever you need it:

    ```jsx
    // Example: resources/js/Components/App.jsx

    import React from "react";
    import SidebarNav from "../Components/SideNavbar";
    import AppNavbar from "../Components/AppNavbar";

    const App = () => {
        return (
            <div className="flex flex-col min-h-screen">
                <AppNavbar />
                <div className="flex flex-1">
                    <SidebarNav theme="light" />
                    {/* Rest of your application */}
                </div>
            </div>
        );
    };

    export default App;
    ```

4. **Ensure the `ThemeProvider` is set up** to handle light and dark themes:

    ```jsx
    // Example: resources/js/Components/ThemeProvider.jsx

    import { ThemeProvider as NextThemesProvider } from "next-themes";

    const ThemeProvider = ({ children }) => {
        return <NextThemesProvider>{children}</NextThemesProvider>;
    };

    export default ThemeProvider;
    ```

5. **Wrap your main application with `ThemeProvider`** to enable theme switching:

    ```jsx
    // Example: resources/js/App.jsx

    import React from "react";
    import ThemeProvider from "./ThemeProvider";
    import App from "./Components/App";

    const MainApp = () => {
        return (
            <ThemeProvider>
                <App />
            </ThemeProvider>
        );
    };

    export default MainApp;
    ```

6. **Create the required icon components** inside the `icons` folder:

    For example:

    ```jsx
    // resources/js/Components/icons/SunIcon.jsx

    const SunIcon = ({ width, height }) => (
        <svg width={width} height={height} /* SVG content here */></svg>
    );

    export default SunIcon;

    // resources/js/Components/icons/MoonIcon.jsx

    const MoonIcon = ({ width, height }) => (
        <svg width={width} height={height} /* SVG content here */></svg>
    );

    export default MoonIcon;

    // resources/js/Components/icons/LogoutIcon.jsx

    const LogoutIcon = ({ width, height }) => (
        <svg width={width} height={height} /* SVG content here */></svg>
    );

    export default LogoutIcon;

    // resources/js/Components/icons/UserIdIcon.jsx

    const UserIdIcon = ({ width, height }) => (
        <svg width={width} height={height} /* SVG content here */></svg>
    );

    export default UserIdIcon;
    ```

## Step 5: Create a `SidebarNav` Component

1. **Create a `SideNavbar` folder** in `resources/js/Components`:

    ```bash
    mkdir -p resources/js/Components/SideNavbar
    ```

2. **Create an `index.jsx` file** inside the `SideNavbar` folder with the following content:

    ```jsx
    // resources/js/Components/SideNavbar/index.jsx

    import { Button } from "@nextui-org/react";
    import NavItems from "./NavItems";
    import { useSideNavState } from "@/SideNavStateProvider";
    import { ArrowRightIcon } from "./icons";

    const SidebarNav = ({ theme }) => {
        const { sideNavState, toggleSideNavState } = useSideNavState();

        return (
            <div
                className={`
                    flex-none 
                    ${sideNavState === "collapse" ? "w-16" : "w-60"} 
                    rounded-none 
                    p-2 
                    border-default-400/30
                    transition-all 
                    delay-150 
                    duration-250 
                    overflow-hidden
                    h-[calc(100vh-4rem)]
                    fixed
                    left-0 top-[4rem]
                    ${theme === "light" && "bg-white"}
                    shadow-md
                `}
            >
                <div className="flex flex-col justify-between h-full">
                    <div className="flex-grow">
                        <NavItems sidebarView={sideNavState} />
                    </div>
                    <div className="text-right mb-5">
                        <Button
                            size="md"
                            radius="lg"
                            color="primary"
                            isIconOnly
                            onClick={toggleSideNavState}
                        >
                            <ArrowRightIcon
                                className={`
                                    ${
                                        sideNavState !== "collapse" &&
                                        "-rotate-180"
                                    } 
                                    transition-all 
                                    transform
                                `}
                                width="20px"
                                height="20px"
                            />
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    export default SidebarNav;
    ```

3. **Create a `NavItems` folder** inside the `SideNavbar` folder:

    ```bash
    mkdir resources/js/Components/SideNavbar/NavItems
    ```

4. **Create an `index.jsx` file** inside the `NavItems` folder with the following content:

    ```jsx
    // resources/js/Components/SideNavbar/NavItems/index.jsx

    import { Button, Tooltip } from "@nextui-org/react";
    import { usePage, router } from "@inertiajs/react";
    import { items } from "./items";

    const NavItems = ({ sidebarView }) => {
        const { url } = usePage();

        return (
            <div className="flex flex-col gap-2 items-center w-full py-3">
                {items.map((item) => (
                    <Tooltip
                        key={item.key}
                        isDisabled={sidebarView !== "collapse"}
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
                            variant={
                                url.startsWith(item.url) ? "flat" : "light"
                            }
                            color={"primary"}
                            startContent={item.icon(26, 26)}
                            isIconOnly={
                                sidebarView === "collapse" ? true : false
                            }
                            className={`${
                                sidebarView !== "collapse" &&
                                "justify-start w-auto"
                            } text-foreground gap-5 w-full transition-all delay-200 duration-300`}
                            disabled={url.startsWith(item.url)}
                            onClick={() => router.visit(item.url)}
                        >
                            {
                                <p
                                    className={`${
                                        sidebarView !== "collapse" &&
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
    ```

5. **Create an `items.js` file** inside the `NavItems` folder to define the navigation items:

    ```js
    // resources/js/Components/SideNavbar/NavItems/items.js

    import HomeIcon from "../icons/HomeIcon";
    import SettingsIcon from "../icons/SettingsIcon";

    export const items = [
        {
            key: "home",
            label: "Home",
            icon: HomeIcon,
            url: "/home",
        },
        {
            key: "settings",
            label: "Settings",
            icon: SettingsIcon,
            url: "/settings",
        },
        // Add more items as needed
    ];
    ```

6. **Create an `icons` folder** inside the `SideNavbar` folder, if you haven't already, and add the required icon components.

    For example:

    ```jsx
    // resources/js/Components/SideNavbar/icons/HomeIcon.jsx

    const HomeIcon = (width, height) => (
        <svg width={width} height={height} /* SVG content here */></svg>
    );

    export default HomeIcon;

    // resources/js/Components/SideNavbar/icons/SettingsIcon.jsx

    const SettingsIcon = (width, height) => (
        <svg width={width} height={height} /* SVG content here */></svg>
    );

    export default SettingsIcon;
    ```

7. **Import and use the `SidebarNav` component** in your main layout or wherever you need it:

    ```jsx
    // Example: resources/js/components/App.jsx

    import React from "react";
    import SidebarNav from "../Components/SideNavbar";

    const App = () => {
        return (
            <div className="flex">
                <SidebarNav theme="light" />
                {/* Rest of your application */}
            </div>
        );
    };

    export default App;
    ```

## Step 6: Modify `js/app.jsx` for Inertia-React Setup

1. **Update the `resolve` and `setup` parts of `createInertiaApp`** in `js/app.jsx`:

    ```jsx
    // resources/js/app.jsx

    import React from "react";
    import { createRoot } from "react-dom/client";
    import { createInertiaApp } from "@inertiajs/react";
    import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
    import { NextUIProvider } from "@nextui-org/react";
    import AppLayout from "@/Layouts/AppLayout";
    import ThemeProvider from "./ThemeProvider";
    import { SidebarViewStateProvider } from "@/SidebarViewStateProvider";

    createInertiaApp({
        resolve: (name) => {
            let pages = resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob("./Pages/**/*.jsx")
            );
            pages.then((page) => {
                page.default.layout =
                    page.default.layout ||
                    ((page) => <AppLayout>{page}</AppLayout>);
                return page;
            });
            return pages;
        },
        setup({ el, App, props }) {
            const root = createRoot(el);

            root.render(
                <React.StrictMode>
                    <NextUIProvider>
                        <ThemeProvider>
                            <SidebarViewStateProvider>
                                <App {...props} />
                            </SidebarViewStateProvider>
                        </ThemeProvider>
                    </NextUIProvider>
                </React.StrictMode>
            );
        },
    });
    ```

_Explanation of changes_: - The `resolve` function now sets a default layout (`AppLayout`) for pages that do not specify one. - The `setup` function initializes the root element with a nested structure including `NextUIProvider`, `ThemeProvider`, and `SidebarViewStateProvider` to ensure the entire application has access to UI themes and sidebar state.

2.  **Ensure your `AppLayout` is properly defined**:

    ```jsx
    // resources/js/Layouts/AppLayout.jsx

    import React from "react";

    import { usePage } from "@inertiajs/react";
    import AppNavbar from "@/Components/AppNavbar";
    import SidebarNav from "@/Components/SidebarNav";
    import { useTheme } from "@/ThemeProvider";
    import { useSidebarViewState } from "@/SidebarViewStateProvider";
    import { Spacer } from "@nextui-org/react";

    const AppLayout = ({ children }) => {
        const { component } = usePage();
        const { sidebarView } = useSidebarViewState();
        const theme = useTheme().theme;

        switch (component.startsWith("Auth/")) {
            // if the component is in login, use LoginLayout
            case true:
                return <main>{children}</main>;

            default:
                return (
                    <main
                        className={`${theme} text-foreground bg-background flex flex-col h-screen `}
                    >
                        <AppNavbar />
                        <div
                            className={`flex flex-grow overflow-auto bg-slate-300/10`}
                        >
                            {/* Side Navbar */}
                            <SidebarNav />
                            <Spacer
                                x={sidebarView === "collapse" ? 16 : 52}
                                className="transition-all delay-150 duration-100"
                            />
                            <div
                                className={`
                                            flex-grow p-10 overflow-y-auto  bg-slate-400/10
                                        `}
                            >
                                {children}
                            </div>
                        </div>
                    </main>
                );
        }
    };

    export default AppLayout;
    ```

This completes the setup of `createInertiaApp` with the `resolve` and `setup` functions properly configured. The application now uses `AppLayout` as a default layout for all pages, and the main app component is wrapped with necessary providers for UI themes and sidebar state.

## Step 7: Create the `AuthLayout` Component

1. **Navigate to `js/Layouts` and add a new file `AuthLayout.jsx`**:

    ```jsx
    // resources/js/Layouts/AuthLayout.jsx

    import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
    import { usePage } from "@inertiajs/react";
    import { asset } from "@/utils/helpers";

    const appName = import.meta.env.VITE_APP_NAME || "Laravel";

    export default function AuthLayout({ children }) {
        const { component } = usePage();
        return (
            <div className="min-h-screen flex flex-col sm:justify-center items-center bg-gray-100">
                <Card
                    className={`w-full max-w-full px-6 py-4 bg-white overflow-hidden ${
                        component === "Auth/Login"
                            ? "sm:max-w-md"
                            : "sm:max-w-4xl"
                    }`}
                >
                    <CardHeader className="block gap-3">
                        <div className="flex items-center justify-center mb-5 sm:mb-2">
                            <Image
                                width={100}
                                alt="App logo"
                                src={asset("PropertyStream.png")}
                            />
                        </div>
                        <h1 className="text-2xl mb-2">
                            Welcome to&nbsp;
                            <span className="text-primary font-extrabold">
                                {appName}.
                            </span>
                        </h1>
                        <p className="text-sm">
                            {component.includes("Register")
                                ? "You need to register as a system administrator."
                                : "Please login using your registered account."}
                        </p>
                    </CardHeader>
                    <CardBody>{children}</CardBody>
                </Card>
            </div>
        );
    }
    ```

2. **Explanation of the `AuthLayout.jsx` code**:
    - The `AuthLayout.jsx` file imports components from `@nextui-org/react`, `usePage` from `@inertiajs/react`, and a helper function `asset`.
    - The `AuthLayout` component uses the `usePage` hook to get the current page component name.
    - The layout conditionally applies styles based on the current component (e.g., login or register).
    - The layout displays the application logo, a welcome message, and a prompt based on whether the user is on the login or registration page.

## Step 8: Create the `Login` Page

1. **Navigate to `js/Pages/Auth` and add a new file `Login.jsx`**:

    ```jsx
    // resources/js/Pages/Auth/Login.jsx

    import { Head } from "@inertiajs/react";
    import AuthLayout from "@/Layouts/AuthLayout";
    import { LoginForm } from "@/Components/Forms/LoginForm";

    const Login = ({ status }) => {
        return (
            <AuthLayout>
                <Head title="Log in" />

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}

                <LoginForm />
            </AuthLayout>
        );
    };

    export default Login;
    ```

_Explanation of the `Login.jsx` code_: - The `Login.jsx` file imports `LoginForm`, `AuthLayout`, and `Head` components. - The `Head` component is used to set the page title. - The `Login` component renders the `LoginForm` within the `AuthLayout`. - The `status` prop is used to display any status messages.

2.  **Ensure your `LoginForm` is properly defined**:

        *Navigate to `js/Components` and create a folder called `Forms`. Inside the `Forms` folder, create a file named `LoginForm.jsx` and insert the following code*:

            ```jsx
            // resources/js/Components/Forms/LoginForm.jsx

            import React from "react";
            import { UserIdIcon } from "./icons";
            import { Button, Checkbox, Input } from "@nextui-org/react";
            import Alert from "../Alert";
            import PasswordInput from "./PasswordInput";
            import { useForm } from "@inertiajs/react";

            export const LoginForm = () => {
                const { data, setData, post, processing, errors, reset } = useForm({
                    hris_id: "",
                    password: "",
                    remember: false,
                });

                React.useEffect(() => {
                    return () => {
                        reset("password");
                    };
                }, []);

                const submit = (e) => {
                    e.preventDefault();
                    errors.message = null;
                    post(route("login"), { replace: true });
                };

                return (
                    <>
                        {errors.message && (
                            <Alert
                                title="Login failed."
                                type="error"
                                message={errors.message}
                                variant={"flat"}
                            />
                        )}
                        <form onSubmit={submit}>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <Input
                                        label="HRIS ID "
                                        name="hris_id"
                                        id="hris_id"
                                        placeholder="Enter your HRIS ID"
                                        variant="bordered"
                                        autoComplete="hris_id"
                                        value={data.hris_id}
                                        onChange={(e) => setData("hris_id", e.target.value)}
                                        classNames={{
                                            label: "text-black dark:text-white/90 font-bold",
                                            inputWrapper: "border-slate-400",
                                        }}
                                        startContent={<UserIdIcon />}
                                        isRequired
                                    />
                                </div>

                                <div className="mt-5">
                                    <PasswordInput
                                        name="password"
                                        label="Password"
                                        placeholder="Enter your password"
                                        value={data.password}
                                        setValue={(val) => setData("password", val)}
                                        error={errors.password}
                                    />
                                </div>

                                <div className="block mt-4">
                                    <Checkbox
                                        defaultValue={data.remember}
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.target.checked)
                                        }
                                        size="sm"
                                    >
                                        Remember me
                                    </Checkbox>
                                </div>

                                <Button
                                    color="primary"
                                    isLoading={processing}
                                    type="submit"
                                    fullWidth
                                >
                                    Log in
                                </Button>
                            </div>
                        </form>
                    </>
                );
            };
            ```

        _Navigate to the `Forms` folder and create a file called `PasswordInput.jsx`. Insert the following code_:

            ```jsx
            // resources/js/Components/Forms/PasswordInput.jsx

            import React from "react";
            import { Input } from "@nextui-org/react";
            import { EyeFilledIcon, EyeSlashFilledIcon, LockIcon } from "./icons";

            export default function PasswordInput({
                label,
                labelPlacement,
                name,
                error,
                placeholder,
                value,
                setValue,
            }) {
                const [isVisible, setIsVisible] = React.useState(false);

                const toggleVisibility = () => setIsVisible(!isVisible);

                return (
                    <Input
                        name={name}
                        id={name}
                        type={isVisible ? "text" : "password"}
                        label={label}
                        labelPlacement={labelPlacement}
                        placeholder={placeholder}
                        variant="bordered"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        color={!!error ? "danger" : "default"}
                        isInvalid={!!error}
                        errorMessage={error}
                        classNames={{
                            label: "text-black dark:text-white/90 font-bold",
                            inputWrapper: "border-slate-400",
                        }}
                        startContent={<LockIcon />}
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                            >
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        isRequired
                    />
                );
            }
            ```

        _Navigate to the `Forms` folder and create a file called `icons.jsx`. Insert the following code:_:

        ```jsx
        // resources/js/Components/Forms/icons.jsx
        export const EmailIcon = (props) => (
                <svg
                    fill={props.fill || "currentColor"}
                    height={props.height || 20}
                    width={props.width || 20}
                    version="1.1"
                    id="Icons"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                >
                    <path
                        d="M26.2,8.5c-2.2-3.2-5.6-5.2-9.3-5.5c-0.3,0-0.6,0-0.9,0c-3.7,0-7.2,1.6-9.7,4.3c-2.5,2.7-3.6,6.4-3.2,10.1
                        c0.7,6,5.5,10.8,11.5,11.4C15,29,15.5,29,16,29c2.6,0,5-0.7,7.2-2.2c0.5-0.3,0.6-0.9,0.3-1.4c-0.3-0.5-0.9-0.6-1.4-0.3
                        c-2.2,1.4-4.7,2.1-7.3,1.8c-5.1-0.5-9.1-4.6-9.7-9.7C4.7,14.1,5.7,11,7.8,8.7c2.3-2.5,5.6-3.9,9-3.6c3.2,0.2,6,1.9,7.8,4.6
                        c1.9,2.9,2.4,6.3,1.3,9.6l0,0.1c-0.3,1-1.3,1.7-2.4,1.7c-1.4,0-2.5-1.1-2.5-2.5V17v-2v-4c0-0.6-0.4-1-1-1s-1,0.4-1,1v0
                        c-0.8-0.6-1.9-1-3-1c-2.8,0-5,2.2-5,5v2c0,2.8,2.2,5,5,5c1.4,0,2.6-0.6,3.5-1.4c0.7,1.4,2.2,2.4,4,2.4c1.9,0,3.6-1.2,4.3-3.1l0-0.1
                        C29.1,16,28.5,11.9,26.2,8.5z M19,17c0,1.7-1.3,3-3,3s-3-1.3-3-3v-2c0-1.7,1.3-3,3-3s3,1.3,3,3V17z"
                    />
                </svg>

            );

        export const EyeFilledIcon = (props) => (
        <svg
        {...props}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg" >
        <path
                    d="M1.60603 6.08062C2.11366 5.86307 2.70154 6.09822 2.9191 6.60585L1.99995 6.99977C2.9191 6.60585 2.91924 6.60618 2.9191 6.60585L2.91858 6.60465C2.9183 6.604 2.91851 6.60447 2.91858 6.60465L2.9225 6.61351C2.92651 6.62253 2.93339 6.63785 2.94319 6.65905C2.96278 6.70147 2.99397 6.76735 3.03696 6.85334C3.12302 7.02546 3.25594 7.27722 3.43737 7.58203C3.80137 8.19355 4.35439 9.00801 5.10775 9.81932C5.28532 10.0105 5.47324 10.2009 5.67173 10.3878C5.68003 10.3954 5.68823 10.4031 5.69633 10.4109C7.18102 11.8012 9.25227 12.9998 12 12.9998C13.2089 12.9998 14.2783 12.769 15.2209 12.398C16.4469 11.9154 17.4745 11.1889 18.3156 10.3995C19.2652 9.50815 19.9627 8.54981 20.4232 7.81076C20.6526 7.44268 20.8207 7.13295 20.9299 6.91886C20.9844 6.81192 21.0241 6.72919 21.0491 6.67538C21.0617 6.64848 21.0706 6.62884 21.0758 6.61704L21.0808 6.60585C21.2985 6.0985 21.8864 5.86312 22.3939 6.08062C22.9015 6.29818 23.1367 6.88606 22.9191 7.39369L22 6.99977C22.9191 7.39369 22.9192 7.39346 22.9191 7.39369L22.9169 7.39871L22.9134 7.40693L22.9019 7.43278C22.8924 7.4541 22.879 7.48354 22.8618 7.52048C22.8274 7.59434 22.7774 7.69831 22.7115 7.8275C22.5799 8.08566 22.384 8.44584 22.1206 8.86844C21.718 9.5146 21.152 10.316 20.4096 11.1241L21.2071 11.9215C21.5976 12.312 21.5976 12.9452 21.2071 13.3357C20.8165 13.7262 20.1834 13.7262 19.7928 13.3357L18.9527 12.4955C18.3884 12.9513 17.757 13.3811 17.0558 13.752L17.8381 14.9544C18.1393 15.4173 18.0083 16.0367 17.5453 16.338C17.0824 16.6392 16.463 16.5081 16.1618 16.0452L15.1763 14.5306C14.4973 14.7388 13.772 14.8863 13 14.9554V16.4998C13 17.0521 12.5522 17.4998 12 17.4998C11.4477 17.4998 11 17.0521 11 16.4998V14.9556C10.2253 14.8864 9.50014 14.7386 8.82334 14.531L7.83814 16.0452C7.53693 16.5081 6.91748 16.6392 6.45457 16.338C5.99165 16.0367 5.86056 15.4173 6.16177 14.9544L6.94417 13.7519C6.24405 13.3814 5.61649 12.9564 5.05725 12.5097L4.20711 13.3357C3.81658 13.7262 3.18342 13.7262 2.79289 13.3357C2.40237 12.9452 2.40237 12.312 2.79289 11.9215L3.61886 11.0955C2.85534 10.261 2.25177 9.42129 1.8284 8.71488C1.58815 8.31179 1.4043 7.9597 1.28344 7.70197C1.22299 7.57363 1.17463 7.46998 1.1397 7.39683C1.12223 7.36029 1.10852 7.33272 1.09889 7.31482L1.09364 7.30538L1.09361 7.30531C1.09356 7.30522 1.09359 7.30528 1.09361 7.30531C0.87606 6.79768 1.11121 6.2098 1.61885 5.99224C1.8399 5.89767 2.07912 5.90696 2.28735 6.00069L1.60603 6.08062Z"
                    fill="currentColor"
                />
        </svg>
        );

        export const EyeOffIcon = (props) => (
        <svg
        {...props}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg" >
        <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.194 6.225A11.923 11.923 0 0 0 1 11.993a11.926 11.926 0 0 0 10.95 6.984 11.96 11.96 0 0 0 4.12-.719l.887.888a9.975 9.975 0 0 1-4.998 1.323c-4.205 0-7.87-2.42-9.794-5.996a10.927 10.927 0 0 1 2.687-3.65L2.808 6.808a.75.75 0 0 1 1.06-1.06l1.326 1.326ZM9.18 10.212a2.925 2.925 0 0 0 3.858 3.858l.933.933A4.425 4.425 0 0 1 7.42 9.28l.933.933ZM9.994 6.009c.433-.055.875-.01 1.303.1c2.486.371 4.624 2.106 5.683 4.601l.751.751C17.557 8.568 15.56 6.5 13 6.5a4.506 4.506 0 0 0-2.78.963l.632.632a2.925 2.925 0 0 0 3.858 3.858l.933.933A4.425 4.425 0 0 1 7.42 9.28l.933.933ZM12 14.5a2.925 2.925 0 0 0 3.858-3.858l.933-.933A4.425 4.425 0 0 1 7.42 9.28l.933.933a2.925 2.925 0 0 0 3.858 3.858l.933.933A4.425 4.425 0 0 1 7.42 9.28l.933.933Z"
                    fill="currentColor"
                />
        </svg>
        );
        //...

    ```

    This completes the creation of the `Login` page and ensures that it is properly integrated with the layout and form components.
    ```

### 9. Create the `RegisterForm` Component

Set up the `RegisterForm` component within the `Forms` folder to handle user registration. Follow the structure and conventions used in the `LoginForm` component.

Here is the code for the `RegisterForm` component:

```jsx
import React, { useEffect } from "react";
import PasswordInput from "./PasswordInput";
import { useForm } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react"; // Ensure you import necessary components

export const RegisterForm = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        hris_id: "",
        user_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
        contact_no: "",
        employment_status: "",
        office_id: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register.admin"));
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="flex gap-4">
                <Input
                    name="hris_id"
                    id="hris_id"
                    label="HRIS ID"
                    placeholder="Enter your HRIS ID"
                    variant="bordered"
                    autoComplete="hris_id"
                    value={data.hris_id}
                    onChange={(e) => setData("hris_id", e.target.value)}
                    color={!!errors.hris_id ? "danger" : "default"}
                    isInvalid={!!errors.hris_id}
                    errorMessage={errors.hris_id}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                    isRequired
                />
                <Input
                    name="user_id"
                    id="user_id"
                    label="User ID"
                    placeholder="Enter your desired User ID"
                    variant="bordered"
                    autoComplete="user_id"
                    value={data.user_id}
                    onChange={(e) => setData("user_id", e.target.value)}
                    color={!!errors.user_id ? "danger" : "default"}
                    isInvalid={!!errors.user_id}
                    errorMessage={errors.user_id}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                    isRequired
                />
                <Autocomplete
                    name="employment_status"
                    id="employment_status"
                    defaultItems={employmentStatus}
                    label="Employment Status"
                    placeholder="Current employment status"
                    variant="bordered"
                    classNames={{
                        base: "text-black dark:text-white/90 font-bold input-wrapper:border-slate-400",
                    }}
                    isClearable={false}
                    className="min-w-64"
                    menuTrigger="input"
                    onInputChange={(value) =>
                        setData("employment_status", value)
                    }
                    onKeyDown={(e) => e.continuePropagation()} // to stop console error
                    isRequired
                    isInvalid={!!errors.employment_status}
                    errorMessage={errors.employment_status}
                >
                    {(empstat) => (
                        <AutocompleteItem key={empstat.value}>
                            {empstat.label}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </div>

            <div className="flex gap-4 mt-4">
                <Input
                    name="position"
                    id="position"
                    label="Position"
                    placeholder="Enter your current position"
                    variant="bordered"
                    autoComplete="position"
                    value={data.position}
                    onChange={(e) => setData("position", e.target.value)}
                    color={!!errors.position ? "danger" : "default"}
                    isInvalid={!!errors.position}
                    errorMessage={errors.position}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                    isRequired
                />
            </div>

            <div className="flex gap-4 mt-4">
                <Input
                    name="first_name"
                    id="first_name"
                    label="First Name"
                    placeholder="Enter your first name"
                    variant="bordered"
                    autoComplete="first_name"
                    value={data.first_name}
                    onChange={(e) => setData("first_name", e.target.value)}
                    color={!!errors.first_name ? "danger" : "default"}
                    isInvalid={!!errors.first_name}
                    errorMessage={errors.first_name}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                    isRequired
                />
                <Input
                    name="middle_name"
                    id="middle_name"
                    label="Middle Name"
                    placeholder="Enter your middle name"
                    variant="bordered"
                    autoComplete="middle_name"
                    value={data.middle_name}
                    onChange={(e) => setData("middle_name", e.target.value)}
                    color={!!errors.middle_name ? "danger" : "default"}
                    isInvalid={!!errors.middle_name}
                    errorMessage={errors.middle_name}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                />
                <Input
                    name="last_name"
                    id="last_name"
                    label="Last Name"
                    placeholder="Enter your last name"
                    variant="bordered"
                    autoComplete="last_name"
                    value={data.last_name}
                    onChange={(e) => setData("last_name", e.target.value)}
                    color={!!errors.last_name ? "danger" : "default"}
                    isInvalid={!!errors.last_name}
                    errorMessage={errors.last_name}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                    isRequired
                />
            </div>

            <div className="flex gap-4 mt-4">
                <Input
                    type="email"
                    label="Email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    variant="bordered"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    color={!!errors.email ? "danger" : "default"}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                    isRequired
                />
                <Input
                    label="Contact Number"
                    name="contact_no"
                    id="contact_no"
                    placeholder="Enter your contact number"
                    variant="bordered"
                    autoComplete="contact_no"
                    value={data.contact_no}
                    onChange={(e) => setData("contact_no", e.target.value)}
                    color={!!errors.contact_no ? "danger" : "default"}
                    isInvalid={!!errors.contact_no}
                    errorMessage={errors.contact_no}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                    }}
                    isRequired
                />
            </div>

            <div className="flex gap-4 mt-4">
                <PasswordInput
                    name="password"
                    label="Password"
                    placeholder="Set your password"
                    value={data.password}
                    setValue={(val) => setData("password", val)}
                    error={errors.password}
                />
                <PasswordInput
                    name="password_confirmation"
                    label="Confirm Password"
                    placeholder="Enter your password again"
                    value={data.password_confirmation}
                    setValue={(val) => setData("password_confirmation", val)}
                    error={errors.password_confirmation}
                />
            </div>

            <div className="flex items-center justify-end mt-4">
                <Button
                    className="ms-4"
                    color="primary"
                    isLoading={processing}
                    type="submit"
                >
                    Register
                </Button>
            </div>
        </form>
    );
};
```
