import Input from "@/Components/Input";
import Select from "@/Components/Select";
import { useTheme } from "@/Contexts/ThemeContext";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    DateRangePicker,
    Spacer,
    Divider,
    Tooltip,
} from "@heroui/react";
import { HelpIcon, TrashIcon } from "./icons";
import { PlusIcon } from "@/Layouts/ListViewLayout/icons";
import useFetch from "@/Hooks/useFetch";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useBoxForm } from "@/Contexts/BoxFormContext";

interface ManageBoxDialogProps {
    isOpen: boolean;
    onClose: () => void;
    editBoxData?: boolean;
}

const priorityLevels = [
    { value: "red", label: "RED (Permanent Files)" },
    { value: "green", label: "GREEN (3 years above retention period)" },
    {
        value: "black",
        label: "BLACK (1-2 years retention period or photocopied documents)",
    },
];

const BoxForm = ({ isOpen, onClose, editBoxData }: ManageBoxDialogProps) => {
    const {
        boxData,
        errors,
        rdsData,
        rdsLoading,
        rdsError,
        saveBoxDataToBoxes,
        onBoxCodeChange,
        onPriorityLevelChange,
        addDocument,
        deleteDocument,
        onDocumentChange,
        onOfficeChange,
        parseDateRange,
    } = useBoxForm();
    const {
        data: offices,
        loading: loadingOffices,
        error: officesError,
    } = useFetch<any[]>(route("offices"));
    const { theme } = useTheme();

    const handleAddBox = () => {
        const hasErrors = saveBoxDataToBoxes();

        !hasErrors && onClose();
    };

    return (
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
                                isRequired
                            />
                            <Select
                                variant="flat"
                                name="priority_level"
                                label="Priority Level"
                                placeholder="Select priority level"
                                items={priorityLevels}
                                keyField={"value"}
                                labelField="label"
                                menuTrigger="input"
                                selectedKeys={new Set([boxData.priority_level])}
                                onSelectionChange={(value) => {
                                    onPriorityLevelChange(value.currentKey);
                                }}
                                isClearable={false}
                                errorMessage={errors.priority_level}
                                isRequired
                            />
                        </div>
                        <Spacer y={4} />
                        <div className="p-3 border border-dashed border-default-500/50 rounded-md">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-foreground">
                                    Documents:
                                </p>
                                <Button
                                    color="primary"
                                    // variant="flat"
                                    size="sm"
                                    onPress={addDocument}
                                    endContent={<PlusIcon />}
                                >
                                    Add Document
                                </Button>
                            </div>
                            <Spacer y={4} />
                            {boxData.box_details.map((details, index) => {
                                return (
                                    <div
                                        className="flex flex-col gap-2"
                                        key={"document-" + index}
                                    >
                                        <div className="flex gap-2">
                                            <Select
                                                autocomplete={true}
                                                variant="flat"
                                                name="document_title"
                                                label="Document Title"
                                                placeholder={
                                                    rdsLoading
                                                        ? "Loading..."
                                                        : "Select document title"
                                                }
                                                items={rdsData || []} // Ensure it's an array
                                                keyField={"id"}
                                                labelField="title_description"
                                                menuTrigger="input"
                                                selectedKeys={
                                                    boxData.box_details[index]
                                                        .id
                                                }
                                                onSelectionChange={(
                                                    key: string
                                                ) =>
                                                    onDocumentChange(
                                                        index,
                                                        "id",
                                                        key
                                                    )
                                                }
                                                isClearable={false}
                                                errorMessage={
                                                    errors.box_details[index]
                                                        .document_title ||
                                                    rdsError
                                                }
                                                isRequired
                                                isDisabled={rdsLoading}
                                                section={"department"}
                                            />

                                            <DateRangePicker
                                                label="Document Date"
                                                value={parseDateRange(
                                                    details.document_date
                                                )}
                                                aria-label="Select document date"
                                                onChange={(value) =>
                                                    onDocumentChange(
                                                        index,
                                                        "document_date",
                                                        value
                                                    )
                                                }
                                                classNames={{ base: "w-1/3" }}
                                                maxValue={today(
                                                    getLocalTimeZone()
                                                )}
                                                errorMessage={
                                                    errors.box_details[index]
                                                        .document_date
                                                }
                                                isRequired
                                                showMonthAndYearPickers
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                label="RDS number"
                                                name="rds_number"
                                                placeholder="This is automatically filled"
                                                value={details.rds_number}
                                                maxWidthClass={"w-2/4"}
                                                endContent={
                                                    <Tooltip
                                                        className="text-tiny w-60"
                                                        placement="bottom-end"
                                                        content={
                                                            "RDS number is a based on the document. A corresponding RDS number is assigned to each document."
                                                        }
                                                    >
                                                        <div className="z-50">
                                                            <HelpIcon />
                                                        </div>
                                                    </Tooltip>
                                                }
                                                isReadOnly
                                            />
                                            <Input
                                                label="Retention Period"
                                                name="retention_period"
                                                placeholder="This is automatically filled"
                                                value={details.retention_period}
                                                maxWidthClass={"w-2/4"}
                                                endContent={
                                                    <Tooltip
                                                        className="text-tiny w-60"
                                                        placement="bottom-end"
                                                        content={
                                                            "Retention period is a based on the RDS number or document."
                                                        }
                                                    >
                                                        <div className="z-50">
                                                            <HelpIcon />
                                                        </div>
                                                    </Tooltip>
                                                }
                                                isReadOnly
                                            />
                                            <Button
                                                key={"delete-document-" + index}
                                                color="danger"
                                                variant="flat"
                                                size="lg"
                                                onPress={() =>
                                                    deleteDocument(index)
                                                }
                                                endContent={<TrashIcon />}
                                                className="w-1/4"
                                                isDisabled={
                                                    boxData.box_details
                                                        .length <= 1
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        {index + 1 !==
                                            boxData.box_details.length && (
                                            <>
                                                <Spacer y={2} />
                                                <Divider />
                                                <Spacer y={3} />
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <Spacer y={2} />
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
                                        <div className="z-50">
                                            <HelpIcon />
                                        </div>
                                    </Tooltip>
                                }
                                isReadOnly
                            />
                            <Select
                                autocomplete={true}
                                variant="flat"
                                name="office"
                                label="Office"
                                placeholder={
                                    loadingOffices
                                        ? "Loading offices..."
                                        : "Enter end-user office department/section/office"
                                }
                                items={offices} // Now, offices is guaranteed to be an array
                                keyField={"id"}
                                labelField="name"
                                menuTrigger="input"
                                selectedKeys={boxData.office}
                                onSelectionChange={onOfficeChange}
                                isClearable={false}
                                errorMessage={errors.office || officesError}
                                isRequired
                                isDisabled={loadingOffices || !!officesError}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="default"
                            variant="flat"
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleAddBox}>
                            Add
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
};

export default BoxForm;
