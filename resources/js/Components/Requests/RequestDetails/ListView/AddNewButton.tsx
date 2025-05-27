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

export default function App() {
    const { showAlert } = useModalAlert();
    const onCreateRequest = async (type: Key) => {};

    return (
        <div className="flex items-center gap-2">
            <NewBoxForm />

            <Dropdown>
                <DropdownTrigger>
                    <Button
                        color="secondary"
                        endContent={<Icon name="save" size={18} />}
                    >
                        Save
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Save Actions"
                    // onAction={(key) => handleSaveAction(key)}
                >
                    <DropdownItem key="draft">Save as Draft</DropdownItem>
                    <DropdownItem key="print">Save and Print</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
