import Select from "@/Components/Select";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Textarea,
    Input,
} from "@heroui/react";
import { useForm } from "@inertiajs/react";

const statusOptions = [
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

export default function UpdateStatusAction({ item }: { item: any }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { data, setData, errors, clearErrors, reset, processing, post } =
        useForm<{
            id: number;
            status: string;
            remarks: string;
            approved_form?: File | null; // Optional, only required if status is "approved"
        }>({
            id: item.id,
            status: "",
            remarks: "",
            approved_form: null,
        });

    const { showAlert } = useModalAlert(); // use your context here

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("requests.update-status"), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            only: ["response"],
            onSuccess: () => {
                showAlert({
                    type: "success",
                    title: "Status Updated!",
                    message: `Request status successfully set to ${data.status}.`,
                    autoClose: true,
                });
                reset();
                onClose();
            },
            onError: () => {
                showAlert({
                    type: "error",
                    title: "Update Failed",
                    message: "Something went wrong while updating the status.",
                    autoClose: true,
                });
            },
        });
    };

    return (
        <>
            <Button size="sm" color="secondary" onPress={onOpen}>
                Update Status
            </Button>

            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top"
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSubmit}>
                            <ModalHeader className="flex flex-col gap-1">
                                Set Request Status
                            </ModalHeader>

                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-default-600 italic">
                                        Are you sure you want to update the
                                        status of this request? This action
                                        cannot be undone.
                                    </p>

                                    <div className="flex flex-col gap-4">
                                        <Select
                                            autocomplete={false}
                                            variant="flat"
                                            name="status"
                                            label="Update status to"
                                            labelPlacement="outside"
                                            placeholder="e.g. Pending, Approved, Rejected"
                                            items={statusOptions}
                                            keyField={"value"}
                                            labelField={"label"}
                                            menuTrigger="input"
                                            onSelectionChange={(
                                                key: string
                                            ) => {
                                                clearErrors(
                                                    "status",
                                                    "remarks"
                                                );
                                                setData(
                                                    "status",
                                                    Array.from(key)[0]
                                                );
                                            }}
                                            isClearable={false}
                                            errorMessage={errors.status}
                                            isRequired
                                        />

                                        {data.status === "approved" && (
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                isRequired
                                                name="approved_form"
                                                label="Upload Approved Form"
                                                labelPlacement="outside"
                                                isDisabled={processing}
                                                onChange={(e) => {
                                                    clearErrors(
                                                        "approved_form"
                                                    );
                                                    if (
                                                        e.target.files &&
                                                        e.target.files.length >
                                                            0
                                                    ) {
                                                        setData(
                                                            "approved_form",
                                                            e.target.files[0]
                                                        );
                                                    }
                                                }}
                                                classNames={{
                                                    label: "font-bold",
                                                }}
                                            />
                                        )}

                                        <Textarea
                                            label="Remarks"
                                            labelPlacement="outside"
                                            placeholder={
                                                data.status === "rejected"
                                                    ? "Please tell us the reason why the request was rejected"
                                                    : "Enter your remarks here..."
                                            }
                                            value={data.remarks}
                                            onValueChange={(value: string) => {
                                                console.log(
                                                    "status:",
                                                    data.status
                                                );
                                                clearErrors("remarks");
                                                setData("remarks", value);
                                            }}
                                            errorMessage={errors.remarks}
                                            isRequired={
                                                data.status === "rejected"
                                            }
                                            isInvalid={
                                                data.status === "rejected" &&
                                                !data.remarks
                                            }
                                            classNames={{
                                                label: "font-bold",
                                            }}
                                        />
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={() => {
                                        reset();
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="secondary"
                                    isDisabled={processing}
                                    type="submit"
                                >
                                    {processing ? "Updating..." : "Update"}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
