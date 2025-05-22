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
import { useModalAlert } from "@/Contexts/ModalAlertContext";

export default function App() {
    const { showAlert } = useModalAlert();
    const onCreateRequest = async (type: Key) => {
        try {
            const response = await axiosInstance.post(
                `/request/create/${type}`
            );
            const form_no = response.data.form_no;

            console.log("Request created!", response.data);

            // Redirect to the newly created request
            router.visit(`/request/${form_no}`);
        } catch (error: any) {
            showAlert({
                type: "error",
                title: "Failed to create request",
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "An unknown error occurred.",
                autoClose: false,
            });
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
