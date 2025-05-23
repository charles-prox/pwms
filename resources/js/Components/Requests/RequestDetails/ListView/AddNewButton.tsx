import { Button } from "@heroui/react";
import Icon from "@/Components/Icon";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import NewBoxForm from "@/Components/Forms/NewBoxForm";

export default function App() {
    const { showAlert } = useModalAlert();
    const onCreateRequest = async (type: Key) => {};

    return (
        <div className="flex items-center gap-2">
            <NewBoxForm />
            <Button
                className="hidden sm:flex"
                color="secondary"
                endContent={<Icon name="save" size={20} />}
            >
                Save
            </Button>
        </div>
    );
}
