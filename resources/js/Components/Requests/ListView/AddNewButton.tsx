import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@heroui/react";
import { axiosInstance } from "@/Utils/axios";
import { router } from "@inertiajs/react";
import Icon from "@/Components/Icon";

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
        } catch (error: any) {
            // console.error("Failed to create request: ", error);
            alert(
                "Failed to create request: \n" + error.response?.data.message
            );
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    className="hidden sm:flex"
                    color="primary"
                    endContent={<Icon name="plus" size={20} />}
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
