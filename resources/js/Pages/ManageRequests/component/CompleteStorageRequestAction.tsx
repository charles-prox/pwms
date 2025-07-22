import { useModalAlert } from "@/Contexts/ModalAlertContext";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Textarea,
} from "@heroui/react";
import { useForm } from "@inertiajs/react";
import React from "react";

interface BoxLocationData {
    floor: "mezzanine" | "ground" | "";
    rack: string | number;
    bay: string | number;
    level: string | number;
    position: string | number;
}

interface BoxData {
    id: number;
    box_code: string;
    location: BoxLocationData;
    remarks?: string; // Optional, for additional notes
}

interface CompleteRequestFormData {
    id: number;
    status?: string; // Optional, only required if updating status
    boxes: BoxData[];
    [key: string]: any; // Required by Inertia's useForm
}

interface CompleteRequestActionProps {
    item: {
        id: number;
        boxes: {
            id: number;
            box_code: string;
        }[];
    };
}

export default function CompleteStorageRequestAction({
    item,
}: CompleteRequestActionProps) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { showAlert } = useModalAlert(); // use your context here

    const [expandedRemarks, setExpandedRemarks] = React.useState<number[]>([]);

    const toggleRemarks = (index: number) => {
        setExpandedRemarks((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const { data, setData, errors, post, processing, reset } =
        useForm<CompleteRequestFormData>({
            id: item.id,
            status: "completed",
            boxes: item.boxes.map((box) => ({
                id: box.id,
                box_code: box.box_code,
                location: {
                    floor: "",
                    rack: "",
                    bay: "",
                    level: "",
                    position: "",
                },
                remarks: "",
            })),
        });

    const handleSubmit = () => {
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
            <Button size="sm" color="primary" onPress={onOpen}>
                Complete
            </Button>
            <Modal
                isOpen={isOpen}
                size="2xl"
                onOpenChange={onOpenChange}
                placement="top"
            >
                <ModalContent>
                    <>
                        <ModalHeader>Complete this Request</ModalHeader>
                        <ModalBody>
                            <p className="text-sm text-default-600 italic mb-4">
                                Specify the location for each box before marking
                                the request as completed.
                            </p>
                            {data.boxes.map((box, index) => (
                                <div
                                    key={box.id}
                                    className="border p-3 mb-4 rounded"
                                >
                                    <div className="flex flex-row justify-between items-center mb-2">
                                        <h4 className="font-bold mb-2">
                                            Box Code: {box.box_code}
                                        </h4>
                                        <button
                                            type="button"
                                            className="text-blue-500 hover:underline text-sm"
                                            onClick={() => toggleRemarks(index)}
                                        >
                                            {expandedRemarks.includes(index)
                                                ? "Hide Remarks"
                                                : "+ Add Remarks"}
                                        </button>
                                    </div>

                                    <div className="flex gap-4">
                                        <Select
                                            label="Floor"
                                            labelPlacement="outside"
                                            placeholder=" "
                                            className="w-[50rem]"
                                            selectedKeys={
                                                box.location.floor
                                                    ? [box.location.floor]
                                                    : []
                                            }
                                            onSelectionChange={(keys) =>
                                                setData(
                                                    "boxes",
                                                    data.boxes.map((b, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...b,
                                                                  location: {
                                                                      ...b.location,
                                                                      floor: Array.from(
                                                                          keys
                                                                      )[0] as
                                                                          | ""
                                                                          | "mezzanine"
                                                                          | "ground",
                                                                  },
                                                              }
                                                            : b
                                                    )
                                                )
                                            }
                                            isRequired
                                        >
                                            {[
                                                {
                                                    value: "mezzanine",
                                                    label: "Mezzanine",
                                                },
                                                {
                                                    value: "ground",
                                                    label: "Ground",
                                                },
                                            ].map((floor) => (
                                                <SelectItem key={floor.value}>
                                                    {floor.label}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Input
                                            label="Rack"
                                            labelPlacement="outside"
                                            placeholder=" "
                                            type="number"
                                            maxLength={36}
                                            value={String(box.location.rack)}
                                            onChange={(e) =>
                                                setData(
                                                    "boxes",
                                                    data.boxes.map((b, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...b,
                                                                  location: {
                                                                      ...b.location,
                                                                      rack: e
                                                                          .target
                                                                          .value,
                                                                  },
                                                              }
                                                            : b
                                                    )
                                                )
                                            }
                                            isRequired
                                        />
                                        <Input
                                            label="Bay"
                                            labelPlacement="outside"
                                            placeholder=" "
                                            type="number"
                                            maxLength={5}
                                            value={String(box.location.bay)}
                                            onChange={(e) =>
                                                setData(
                                                    "boxes",
                                                    data.boxes.map((b, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...b,
                                                                  location: {
                                                                      ...b.location,
                                                                      bay: e
                                                                          .target
                                                                          .value,
                                                                  },
                                                              }
                                                            : b
                                                    )
                                                )
                                            }
                                            isRequired
                                        />
                                        <Input
                                            label="Level"
                                            labelPlacement="outside"
                                            placeholder=" "
                                            type="number"
                                            maxLength={4}
                                            value={String(box.location.level)}
                                            onChange={(e) =>
                                                setData(
                                                    "boxes",
                                                    data.boxes.map((b, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...b,
                                                                  location: {
                                                                      ...b.location,
                                                                      level: e
                                                                          .target
                                                                          .value,
                                                                  },
                                                              }
                                                            : b
                                                    )
                                                )
                                            }
                                            isRequired
                                        />
                                        <Input
                                            label="Position"
                                            labelPlacement="outside"
                                            placeholder=" "
                                            type="number"
                                            maxLength={9}
                                            value={String(
                                                box.location.position
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "boxes",
                                                    data.boxes.map((b, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...b,
                                                                  location: {
                                                                      ...b.location,
                                                                      position:
                                                                          e
                                                                              .target
                                                                              .value,
                                                                  },
                                                              }
                                                            : b
                                                    )
                                                )
                                            }
                                            isRequired
                                        />
                                    </div>

                                    {expandedRemarks.includes(index) && (
                                        <Textarea
                                            label="Remarks"
                                            labelPlacement="outside"
                                            placeholder="Enter remarks (optional)"
                                            value={box.remarks || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "boxes",
                                                    data.boxes.map((b, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...b,
                                                                  remarks:
                                                                      e.target
                                                                          .value,
                                                              }
                                                            : b
                                                    )
                                                )
                                            }
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
                                variant="light"
                                onPress={() => onClose()}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleSubmit}
                                isDisabled={
                                    data.boxes.some(
                                        (box) =>
                                            !box.location.floor ||
                                            !box.location.rack ||
                                            !box.location.bay ||
                                            !box.location.level ||
                                            !box.location.position
                                    ) || processing
                                }
                                isLoading={processing}
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Complete Request"}
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
}
