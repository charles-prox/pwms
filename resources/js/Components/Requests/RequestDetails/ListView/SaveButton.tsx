import React from "react";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { FormProp } from "@/Utils/types";
import { usePage } from "@inertiajs/react";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import { router } from "@inertiajs/react";
import { axiosInstance } from "@/Utils/axios";
import Icon from "@/Components/Icon";

const SaveButton = () => {
    const { showAlert } = useModalAlert();
    const { boxes } = useBoxForm();
    const { form = null } = usePage<{
        form?: FormProp;
    }>().props;

    const handleSaveAction = async (key: Key) => {
        if (key === "draft") {
            try {
                const response = await axiosInstance.post(
                    `/request/${form?.form_number}/save-draft`,
                    {
                        boxes: boxes,
                    }
                );
                router.reload();
                showAlert({
                    title: "Save as Draft",
                    message: "Your request has been saved as a draft.",
                    type: "success",
                });
            } catch (error) {
                console.error("Error saving draft:", error);
                showAlert({
                    title: "Error",
                    message: "Failed to save draft. Please try again.",
                    type: "error",
                });
            }
        } else if (key === "print") {
            showAlert({
                title: "Confirm Print",
                message:
                    "Are you sure you want to save and print this request?",
                mode: "confirm",
                onConfirm: async () => {
                    try {
                        router.post(`/request/${form?.form_number}/print`, {
                            boxes: boxes as any[],
                        });
                        showAlert({
                            type: "success",
                            title: "Sucess",
                            message: "You can now print your request.",
                            autoClose: true,
                            autoCloseDuration: 3000,
                        });
                        // Assuming the response contains a URL to the print view
                        // window.open(response.data.printUrl, "_blank");
                    } catch (error) {
                        console.error("Error printing request:", error);
                        showAlert({
                            title: "Error",
                            message:
                                "Failed to prepare request for printing. Please try again.",
                            type: "error",
                        });
                    }
                },
            });
        }
    };
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    color={!boxes.length ? "default" : "secondary"}
                    endContent={<Icon name="save" size={18} />}
                    isDisabled={!boxes.length}
                >
                    Save
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Save Actions"
                onAction={(key) => handleSaveAction(key)}
            >
                <DropdownItem key="draft">Save as Draft</DropdownItem>
                <DropdownItem key="print">Save and Print</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default SaveButton;
