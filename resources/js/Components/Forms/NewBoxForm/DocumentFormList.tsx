import Input from "@/Components/Shared/Input";
import Select from "@/Components/Shared/Select";
import {
    Button,
    DateRangePicker,
    Spacer,
    Divider,
    Tooltip,
} from "@heroui/react";
import { HelpIcon, TrashIcon } from "../icons";
import { getLocalTimeZone, today } from "@internationalized/date";
import Icon from "@/Components/Icon";
import { useBoxForm } from "@/Contexts/BoxFormContext";

export const DocumentFormList = () => {
    const {
        boxData,
        errors,
        rdsData,
        rdsLoading,
        rdsError,
        deleteDocument,
        onDocumentChange,
        parseDateRange,
        addDocument,
    } = useBoxForm();
    return (
        <div className="p-3 border border-dashed border-default-500/50 rounded-md">
            <div className="flex justify-between items-center">
                <p className="text-sm text-foreground">Documents:</p>
                <Button
                    color="primary"
                    size="sm"
                    onPress={addDocument}
                    endContent={<Icon name="plus" size={16} />}
                >
                    Add Document
                </Button>
            </div>
            <Spacer y={4} />
            {boxData.box_details.map((details, index) => (
                <div className="flex flex-col gap-2" key={"document-" + index}>
                    <div className="flex gap-2">
                        <Select
                            allowsCustomValue
                            autocomplete
                            variant="flat"
                            name="document_title"
                            label="Document Title"
                            placeholder={
                                rdsLoading
                                    ? "Loading..."
                                    : "Select document title"
                            }
                            items={rdsData || []}
                            keyField="id"
                            labelField="title_description"
                            menuTrigger="input"
                            selectedKeys={boxData.box_details[index].id}
                            onSelectionChange={(key: string) =>
                                onDocumentChange(index, "id", key)
                            }
                            isClearable={false}
                            errorMessage={
                                errors.box_details[index]?.document_title ||
                                rdsError
                            }
                            isRequired
                            isDisabled={rdsLoading}
                            section="department"
                        />

                        <DateRangePicker
                            label="Document Date"
                            value={parseDateRange(details.document_date.raw)}
                            aria-label="Select document date"
                            onChange={(value) =>
                                onDocumentChange(index, "document_date", value)
                            }
                            classNames={{ base: "w-1/3" }}
                            maxValue={today(getLocalTimeZone())}
                            errorMessage={
                                errors.box_details[index]?.document_date
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
                            maxWidthClass="w-2/4"
                            endContent={
                                <Tooltip
                                    className="text-tiny w-60"
                                    placement="bottom-end"
                                    content="RDS number is based on the document. A corresponding RDS number is assigned to each document."
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
                        <Input
                            label="Retention Period"
                            name="retention_period"
                            placeholder="This is automatically filled"
                            value={details.retention_period}
                            maxWidthClass="w-2/4"
                            endContent={
                                <Tooltip
                                    className="text-tiny w-60"
                                    placement="bottom-end"
                                    content="Retention period is based on the RDS number or document."
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
                        <Button
                            key={"delete-document-" + index}
                            color="danger"
                            variant="flat"
                            size="lg"
                            onPress={() => deleteDocument(index)}
                            endContent={<TrashIcon />}
                            className="w-1/4"
                            isDisabled={boxData.box_details.length <= 1}
                        >
                            Remove
                        </Button>
                    </div>

                    {index + 1 !== boxData.box_details.length && (
                        <>
                            <Spacer y={2} />
                            <Divider />
                            <Spacer y={3} />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};
