import React, { useState } from "react";
import { SelectedWithdrawalBoxes } from "@/Utils/types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Textarea,
    Tooltip,
} from "@heroui/react";
import { useSelectedBoxes } from "@/Contexts/SelectedBoxesContext";
import Icon from "@/Components/Icon";

interface WithdrawalBoxRemarksModalProps {
    box: SelectedWithdrawalBoxes;
}

export default function WithdrawalBoxRemarksModal({
    box,
}: WithdrawalBoxRemarksModalProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [remarks, setRemarks] = useState(box.withdrawalRemarks || "");
    const { updateWithdrawalRemarks } = useSelectedBoxes();

    const handleSave = () => {
        updateWithdrawalRemarks(box.id, remarks);
        onOpenChange(); // Close modal
    };

    return (
        <>
            <Tooltip
                content={box.withdrawalRemarks ? "Edit Remarks" : "Add Remarks"}
            >
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={onOpen}
                >
                    <Icon name="edit-pen-2" size={20} />
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Edit Remarks for {box.box_code}
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-sm text-gray-600 mb-4">
                                    Add any specific details or instructions for
                                    withdrawing this box.
                                </p>
                                <Textarea
                                    placeholder="Enter remarks"
                                    minRows={8}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleSave}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
