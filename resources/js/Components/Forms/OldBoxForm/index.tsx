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
import { PlusIcon, TrashIcon } from "@/Layouts/ListViewLayout/icons";
import useFetch from "@/Hooks/useFetch";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useBoxForm } from "@/Contexts/BoxFormContext";

interface ManageBoxDialogProps {
    isOpen: boolean;
    onClose: () => void;
    editBoxData?: boolean;
}

const OldBoxForm = ({ isOpen, onClose, editBoxData }: ManageBoxDialogProps) => {
    const {
        boxData,
        errors,
        rdsData,
        rdsLoading,
        rdsError,
        saveBoxDataToBoxes,
        onBoxCodeChange,
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
                                isReadOnly
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
                                                allowsCustomValue={true}
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

                                            <Input
                                                label="Document Date"
                                                name="document_date"
                                                placeholder="This field is automatically filled."
                                                value={
                                                    details.document_date.raw
                                                        ? details.document_date
                                                              .raw
                                                        : ""
                                                }
                                                maxWidthClass={"w-full"}
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                label="RDS number"
                                                name="rds_number"
                                                placeholder="This is automatically filled"
                                                value={details.rds_number}
                                                maxWidthClass={"w-2/4"}
                                                isReadOnly
                                            />
                                            <Input
                                                label="Retention Period"
                                                name="retention_period"
                                                placeholder="This is automatically filled"
                                                value={details.retention_period}
                                                maxWidthClass={"w-2/4"}
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
                                selectedKeys={boxData.office?.id}
                                onSelectionChange={(keys) => {
                                    let value = {
                                        id: keys,
                                        name: offices[keys].name,
                                    };
                                    onOfficeChange(value);
                                }}
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

export default OldBoxForm;
