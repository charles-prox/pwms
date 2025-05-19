import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@heroui/react";
import { axiosInstance } from "@/Utils/axios";
import { router } from "@inertiajs/react";
import { PlusIcon } from "@/Layouts/ListViewLayout/icons";

export default function App() {
    const onCreateRequest = async (type: Key) => {
        try {
            const response = await axiosInstance.post(
                `/requests/create/${type}`
            );
            const form_no = response.data.form_no;

            console.log("Request created!", response.data);

            // Redirect to the newly created request
            router.visit(`/request/${form_no}`);
        } catch (error) {
            console.error("Failed to create request:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    className="hidden sm:flex"
                    color="primary"
                    endContent={<PlusIcon />}
                >
                    Create New Request
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Make Request Actions"
                onAction={(key) => onCreateRequest(key)}
            >
                <DropdownItem key="storage">Storage</DropdownItem>
                <DropdownItem key="withdrawal">Withdrawal</DropdownItem>
                <DropdownItem key="return">Return</DropdownItem>
                <DropdownItem key="disposal">Disposal</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
