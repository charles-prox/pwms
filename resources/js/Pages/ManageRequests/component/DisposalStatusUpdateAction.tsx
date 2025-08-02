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
} from "@heroui/react";
import { router, useForm } from "@inertiajs/react";

const disposalStatusOptions = [
    { label: "Box Marked for Disposal", value: "marked_for_disposal" },
    {
        label: "Checked by Regional Document Custodian",
        value: "checked_by_rdc",
    },
    {
        label: "Transferred to Disposal Area",
        value: "transferred_to_disposal_area",
    },
    { label: "Checked by COA", value: "checked_by_coa" },
    { label: "Waiting for NAP Approval", value: "waiting_for_nap_approval" },
    { label: "NAP Approved for Disposal", value: "nap_approved" },
    { label: "Scheduled for Disposal", value: "scheduled_for_disposal" },
    { label: "Disposed", value: "disposed" },
    { label: "Disposal Certificate Issued", value: "certificate_issued" },

    // Optional / Exception States
    { label: "COA Returned for Correction", value: "coa_returned" },
    { label: "Disposal Cancelled", value: "disposal_cancelled" },
    { label: "Missing or Incomplete Box", value: "box_incomplete" },
    { label: "On Hold / Flagged for Review", value: "on_hold" },
    { label: "Pending Final Review", value: "pending_final_review" },
];

export default function DisposalStatusUpdateAction({ item }: { item: any }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { showAlert } = useModalAlert();

    const { data, setData, errors, clearErrors, reset, processing, post } =
        useForm<{
            id: number;
            status: string;
            remarks: string;
        }>({
            id: item.id,
            status: "",
            remarks: "",
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("requests.update-status"), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            only: ["response", "errors"],
            onSuccess: () => {
                showAlert({
                    type: "success",
                    title: "Status Updated!",
                    message: `Request status successfully set to ${data.status}.`,
                    autoClose: true,
                });
                reset();
                onClose();
                router.reload();
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
                Update
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
                                Update Disposal Request Status
                            </ModalHeader>

                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-default-600 italic">
                                        Confirm updating the disposal status of
                                        this request.
                                    </p>

                                    <div className="flex flex-col gap-4">
                                        <Select
                                            autocomplete={false}
                                            variant="flat"
                                            name="status"
                                            label="Set disposal status to"
                                            labelPlacement="outside"
                                            placeholder="Select status"
                                            items={disposalStatusOptions}
                                            keyField="value"
                                            labelField="label"
                                            menuTrigger="input"
                                            onSelectionChange={(
                                                key: string
                                            ) => {
                                                clearErrors("status");
                                                setData(
                                                    "status",
                                                    Array.from(key)[0]
                                                );
                                            }}
                                            isClearable={false}
                                            errorMessage={errors.status}
                                            isRequired
                                        />

                                        <Textarea
                                            label="Remarks (optional)"
                                            labelPlacement="outside"
                                            placeholder="Enter your remarks here..."
                                            value={data.remarks}
                                            onValueChange={(value: string) => {
                                                clearErrors("remarks");
                                                setData("remarks", value);
                                            }}
                                            errorMessage={errors.remarks}
                                            isInvalid={!!errors.remarks}
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
