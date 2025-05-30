import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import Icon from "@/Components/Icon";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import NewBoxForm from "@/Components/Forms/NewBoxForm";
import { FormProp } from "@/Utils/types";
import { usePage } from "@inertiajs/react";
import { axiosInstance } from "@/Utils/axios";
import { useBoxForm } from "@/Contexts/BoxFormContext";

export default function App() {
    const { showAlert } = useModalAlert();
    const { boxes } = useBoxForm();
    const { form = null } = usePage<{
        form?: FormProp;
    }>().props;

    const handleSaveAction = async (key: Key) => {
        if (key === "draft") {
            try {
                const response = await axiosInstance.post(
                    `/request/${form?.number}/save-draft`,
                    {
                        boxes: boxes,
                    }
                );

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
                title: "Print Request",
                message: "Your request is being prepared for printing.",
                type: "info",
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <NewBoxForm />

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
        </div>
    );
}
