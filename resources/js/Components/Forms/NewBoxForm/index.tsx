import Input from "@/Components/Shared/Input";
import Select from "@/Components/Shared/Select";
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
} from "@heroui/react";
import { HelpIcon } from "../icons";
import useFetch from "@/Hooks/useFetch";
import { useBoxForm } from "@/Contexts/BoxFormContext";
import Icon from "@/Components/Icon";
import { DocumentFormList } from "./DocumentFormList";

interface ManageBoxDialogProps {
    editData?: any;
}

const NewBoxForm = ({ editData }: ManageBoxDialogProps) => {
    const {
        boxData,
        errors,
        saveBoxDataToBoxes,
        onBoxCodeChange,
        onOfficeChange,
    } = useBoxForm();
    const {
        data: offices,
        loading: loadingOffices,
        error: officesError,
    } = useFetch<any[]>(route("offices"));
    const { theme } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleAddBox = () => {
        const hasErrors = saveBoxDataToBoxes();

        !hasErrors && onClose();
    };

    return (
        <>
            <Button
                className="hidden sm:flex"
                color="primary"
                endContent={<Icon name="plus" size={20} />}
                onPress={onOpen}
            >
                Add Box
            </Button>
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
                                            <div className="z-50">
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
                            <DocumentFormList />
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
                                    isDisabled={
                                        loadingOffices || !!officesError
                                    }
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
        </>
    );
};

export default NewBoxForm;
