import Input from "@/Components/Shared/Input";
import { useTheme } from "@/Contexts/ThemeContext";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spacer,
    Tooltip,
    useDisclosure,
    Textarea,
} from "@heroui/react";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import Icon from "@/Components/Icon";
import { DocumentFormList } from "./DocumentFormList";
import React from "react";

interface ManageBoxDialogProps {
    isEditMode?: boolean;
    editBoxId?: number;
    triggerButton?: React.ReactNode;
}

const NewBoxForm = ({ editBoxId, triggerButton }: ManageBoxDialogProps) => {
    const {
        boxData,
        setBoxData,
        errors,
        saveBoxDataToBoxes,
        onBoxCodeChange,
        onRemarksChange,
        getBoxById,
        editBox,
        resetBoxData,
    } = useBoxForm();
    const { theme } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isEditMode, setIsEditMode] = React.useState(false);

    const handleAddBox = () => {
        const hasErrors = saveBoxDataToBoxes();

        !hasErrors && handleClose();
    };

    const handleUpdateBox = () => {
        if (editBoxId) {
            const hasErrors = editBox(boxData);
            !hasErrors && handleClose();
        }
    };

    const handleClose = () => {
        setIsEditMode(false);
        resetBoxData();
        onClose();
    };

    React.useEffect(() => {
        if (isEditMode && editBoxId) {
            const box = getBoxById(editBoxId);
            setBoxData(box);
        }
    }, [editBoxId, onOpen, isEditMode]);

    return (
        <>
            {triggerButton ? (
                React.cloneElement(triggerButton as React.ReactElement, {
                    onPress: () => {
                        setIsEditMode(true);
                        onOpen();
                    },
                })
            ) : (
                <Button
                    className="hidden sm:flex"
                    color="primary"
                    endContent={<Icon name="plus" size={20} />}
                    onPress={onOpen}
                >
                    Add Box
                </Button>
            )}
            <Modal
                isOpen={isOpen}
                placement="top"
                backdrop="blur"
                className={`${theme}`}
                size="4xl"
                hideCloseButton
                aria-label="Add Box"
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-foreground">
                            Add Box
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex gap-2">
                                <Input
                                    label="Box Code"
                                    name="box_code"
                                    placeholder="Enter Box Code"
                                    value={boxData.box_code}
                                    onChange={onBoxCodeChange}
                                    errorMessage={errors.box_code}
                                    isRequired
                                />
                                <Input
                                    label="Priority Level"
                                    name="priority_level"
                                    placeholder="This field is automatically filled."
                                    value={
                                        boxData.priority_level
                                            ? boxData.priority_level.label
                                            : ""
                                    }
                                    maxWidthClass={"w-full"}
                                    endContent={
                                        <Tooltip
                                            className="text-tiny w-96"
                                            placement="bottom-end"
                                            content={
                                                <div>
                                                    <p>
                                                        Priority Level is
                                                        automatically filled
                                                        based on the largest
                                                        retention period of each
                                                        document.
                                                    </p>
                                                    <div className="flex gap-1">
                                                        <p className="w-12">
                                                            RED
                                                        </p>
                                                        <p>-</p>
                                                        <p className="flex-grow">
                                                            Permanent Files
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <p className="w-12">
                                                            GREEN
                                                        </p>
                                                        <p>-</p>
                                                        <p className="flex-grow">
                                                            3 years above
                                                            retention period
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <p className="w-12">
                                                            BLACK
                                                        </p>
                                                        <p>-</p>
                                                        <p className="flex-grow">
                                                            1-2 years retention
                                                            period or
                                                            photocopied
                                                            documents
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <div className="z-50 cursor-help">
                                                <Icon
                                                    name="help"
                                                    size={20}
                                                    className="opacity-30"
                                                />
                                            </div>
                                        </Tooltip>
                                    }
                                    isReadOnly
                                />
                            </div>
                            <Spacer y={4} />
                            <DocumentFormList docs={boxData.box_details} />
                            <Spacer y={2} />
                            <Textarea
                                fullWidth
                                label="Remarks (Optional)"
                                placeholder="Enter your description"
                                classNames={{
                                    label: "text-black dark:text-white/90 font-bold text-sm",
                                    inputWrapper: "border-slate-400",
                                    description: "text-default-500/50",
                                }}
                                value={boxData.remarks}
                                onChange={(e) =>
                                    onRemarksChange(e.target.value)
                                }
                            />
                            <div className="flex gap-2">
                                <Input
                                    label="Disposal Date"
                                    name="disposal_date"
                                    placeholder="This field is automatically filled."
                                    value={boxData.disposal_date}
                                    maxWidthClass={"w-full"}
                                    endContent={
                                        <Tooltip
                                            className="text-tiny w-60"
                                            placement="bottom-end"
                                            content={
                                                "Disposal date is automatically calculated based on the largest retention period of each document."
                                            }
                                        >
                                            <div className="z-50 cursor-help">
                                                <Icon
                                                    name="help"
                                                    size={20}
                                                    className="opacity-30"
                                                />
                                            </div>
                                        </Tooltip>
                                    }
                                    isReadOnly
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
                                variant="flat"
                                onPress={handleClose}
                            >
                                Cancel
                            </Button>
                            {editBoxId ? (
                                <Button
                                    color="primary"
                                    onPress={handleUpdateBox}
                                >
                                    Update
                                </Button>
                            ) : (
                                <Button color="primary" onPress={handleAddBox}>
                                    Add
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NewBoxForm;
