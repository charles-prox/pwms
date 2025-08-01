import React from "react";
import {
    useDisclosure,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    SelectItem,
    Card,
    CardBody,
    Textarea,
    Spacer,
} from "@heroui/react";
import { useForm } from "@inertiajs/react";
import { useModalAlert } from "@/Contexts/ModalAlertContext";

interface Box {
    id: number;
    box_code: string;
}

interface CompleteReturnRequestActionActionProps {
    requestId: number;
    boxes: Box[];
}

const statusValues = [
    { label: "Returned", value: "returned" },
    { label: "Return Failed", value: "return_failed" },
];

const remarksValues = [
    { label: "Returned box not in the request", value: "box_not_in_request" },
    {
        label: "Contents of the box do not match records",
        value: "content_mismatch",
    },
    { label: "Others", value: "others" },
];

const CompleteReturnRequestActionAction: React.FC<
    CompleteReturnRequestActionActionProps
> = ({ requestId, boxes }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { showAlert } = useModalAlert();

    const { data, setData, post, processing, reset } = useForm({
        id: requestId,
        status: "completed",
        boxes: boxes.map((box) => ({
            id: box.id,
            status: "returned",
            remarks: "", // this will be sent to backend
            remarksObj: { value: "", label: "" }, // UI only
        })),
    });

    const handleStatusChange = (index: number, key: Key | undefined) => {
        if (!key) return;

        const value = String(key);
        const updated = [...data.boxes];
        updated[index].status = value as "returned" | "return_failed";

        // Reset remarks if back to withdrawn
        if (value === "returned") {
            updated[index].remarksObj = { value: "", label: "" };
            updated[index].remarks = "";
        }

        setData("boxes", updated);
    };

    const handleRemarksChange = (index: number, key: Key | undefined) => {
        if (!key) return;

        const value = String(key);
        const label =
            value === "others"
                ? ""
                : remarksValues.find((r) => r.value === value)?.label || "";

        const updated = [...data.boxes];
        updated[index].remarksObj = { value, label };
        updated[index].remarks = label; // sync plain remarks string

        setData("boxes", updated);
    };

    const handleRemarksTextChange = (index: number, value: string) => {
        const updated = [...data.boxes];
        updated[index].remarksObj.label = value;
        updated[index].remarks = value; // keep remarks in sync
        setData("boxes", updated);
    };

    const handleSubmit = (onClose: () => void) => {
        post(route("requests.update-status"), {
            preserveScroll: true,
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
            <Button color="primary" size="sm" onPress={onOpen}>
                Complete
            </Button>
            <Modal
                isOpen={isOpen}
                placement="top-center"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Complete Return</ModalHeader>
                            <ModalBody>
                                {boxes.map((box, index) => (
                                    <Card key={box.id} className="mb-3">
                                        <CardBody>
                                            <div className="font-semibold mb-2">
                                                {box.box_code}
                                            </div>

                                            <Select
                                                label="Status"
                                                labelPlacement="outside"
                                                selectedKeys={
                                                    new Set([
                                                        data.boxes[index]
                                                            .status,
                                                    ])
                                                }
                                                onSelectionChange={(keys) => {
                                                    const key =
                                                        Array.from(keys)[0];
                                                    handleStatusChange(
                                                        index,
                                                        key
                                                    );
                                                }}
                                                isRequired
                                            >
                                                {statusValues.map((stat) => (
                                                    <SelectItem
                                                        key={stat.value}
                                                    >
                                                        {stat.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>

                                            <Spacer y={2} />

                                            {data.boxes[index].status ===
                                                "return_failed" && (
                                                <>
                                                    <Select
                                                        label="Reason"
                                                        labelPlacement="outside"
                                                        placeholder="Select reason"
                                                        selectedKeys={
                                                            new Set([
                                                                data.boxes[
                                                                    index
                                                                ].remarksObj
                                                                    .value,
                                                            ])
                                                        }
                                                        onSelectionChange={(
                                                            keys
                                                        ) => {
                                                            const key =
                                                                Array.from(
                                                                    keys
                                                                )[0];
                                                            handleRemarksChange(
                                                                index,
                                                                key
                                                            );
                                                        }}
                                                        isRequired
                                                    >
                                                        {remarksValues.map(
                                                            (remark) => (
                                                                <SelectItem
                                                                    key={
                                                                        remark.value
                                                                    }
                                                                >
                                                                    {
                                                                        remark.label
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </Select>

                                                    {data.boxes[index]
                                                        .remarksObj.value ===
                                                        "others" && (
                                                        <Textarea
                                                            label="Remarks"
                                                            labelPlacement="outside"
                                                            placeholder="Please specify"
                                                            value={
                                                                data.boxes[
                                                                    index
                                                                ].remarksObj
                                                                    .label
                                                            }
                                                            onChange={(e) =>
                                                                handleRemarksTextChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="mt-2"
                                                            isRequired
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </CardBody>
                                    </Card>
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => handleSubmit(onClose)}
                                    isLoading={processing}
                                >
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default CompleteReturnRequestActionAction;
