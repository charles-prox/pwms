import React from "react";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { FormDetails, FormProp } from "@/Utils/types";
import { usePage } from "@inertiajs/react";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import { router } from "@inertiajs/react";
import { axiosInstance } from "@/Utils/axios";
import Icon from "@/Components/Icon";
import { useSelectedBoxes } from "@/Contexts/SelectedBoxesContext";

const SaveButton = () => {
    const { showAlert } = useModalAlert();
    const { boxes } = useBoxForm();
    const { selectedBoxes } = useSelectedBoxes();
    const { form = null } = usePage<{ form?: FormProp }>().props;

    const boxesToSave =
        form?.request_type === "withdrawal" ? selectedBoxes : boxes;

    const handleSaveAction = async (key: Key) => {
        if (key === "draft") {
            try {
                const response = await axiosInstance.post(
                    `/request/${form?.form_number}/save-draft`,
                    { boxes: boxesToSave }
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
                    router.post(
                        `/request/${form?.form_number}/print`,
                        { boxes: boxesToSave },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            only: ["form_details", "show_form"],
                            onSuccess: () => {
                                showAlert({
                                    type: "success",
                                    title: "Success",
                                    message: "Request submitted successfully. The PDF form is being generated...",
                                    autoClose: true,
                                    autoCloseDuration: 3000,
                                });
                            },
                            onError: () => {
                                showAlert({
                                    title: "Error",
                                    message:
                                        "Failed to update request on server.",
                                    type: "error",
                                });
                            },
                        }
                    );
                },
            });
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    color={!boxesToSave.length ? "default" : "secondary"}
                    endContent={<Icon name="save" size={18} />}
                    isDisabled={!boxesToSave.length}
                >
                    Save
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Save Actions"
                onAction={(key) => handleSaveAction(key)}
            >
                {!(
                    form?.request_type === "return" ||
                    form?.request_type === "disposal"
                ) ? (
                    <DropdownItem key="draft">Save as Draft</DropdownItem>
                ) : null}
                <DropdownItem key="print">Submit</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default SaveButton;
