import Input from "@/Components/Input";
import Select from "@/Components/Select";
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
import { BoxDetails } from "@/Utils/types";
import RdsSelector from "./RdsSelector";

interface DocumentFormListProps {
    docs: BoxDetails[];
}

export const DocumentFormList = ({ docs }: DocumentFormListProps) => {
    const {
        errors,
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
            {docs.map((details, index) => {
                console.log("details: ", details);

                return (
                    <div
                        className="flex flex-col gap-2"
                        key={"document-" + index + "-" + details.id}
                    >
                        <div className="flex gap-2">
                            <Input
                                label="Document Title"
                                name="description"
                                placeholder="Document title"
                                value={details.description}
                                onChange={(e) => {
                                    onDocumentChange(
                                        index,
                                        "description",
                                        e.target.value
                                    );
                                }}
                                errorMessage={
                                    errors.box_details[index]?.description
                                }
                                isRequired
                            />
                            {/* <Select
                                allowsCustomValue
                                autocomplete
                                variant="flat"
                                name="document_title"
                                label="RDS Classification"
                                placeholder={
                                    rdsLoading
                                        ? "Loading..."
                                        : "Select appropriate document classification"
                                }
                                items={rdsData || []}
                                keyField="id"
                                labelField="document_title"
                                menuTrigger="input"
                                selectedKeys={details.id?.toString()}
                                onSelectionChange={(key: string) => {
                                    onDocumentChange(index, "id", key);
                                }}
                                isClearable={false}
                                errorMessage={
                                    errors.box_details[index]?.document_title ||
                                    rdsError
                                }
                                isRequired
                                isDisabled={rdsLoading}
                                section="department"
                            /> */}
                            <RdsSelector
                                onChange={(e) => {
                                    onDocumentChange(
                                        index,
                                        "description",
                                        e.target.value
                                    );
                                }}
                                errors={errors.box_details[index]?.description}
                                rds_details={details.description}
                            />
                        </div>

                        <div className="flex gap-2 items-center">
                            <DateRangePicker
                                label="Document Date"
                                value={parseDateRange(details.document_date)}
                                aria-label="Select document date"
                                onChange={(value) =>
                                    onDocumentChange(
                                        index,
                                        "document_date",
                                        value
                                    )
                                }
                                classNames={{ base: "w-1/3" }}
                                maxValue={today(getLocalTimeZone())}
                                errorMessage={
                                    errors.box_details[index]?.document_date
                                }
                                isRequired
                                showMonthAndYearPickers
                            />
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
                                        content="RDS number is based on the document classification. A corresponding RDS number is assigned to each classification."
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
                            <Input
                                label="Max. Aging (years)"
                                name="retention_period"
                                placeholder="This is automatically filled"
                                value={details.retention_period}
                                maxWidthClass="w-2/4"
                                endContent={
                                    <Tooltip
                                        className="text-tiny w-60 "
                                        placement="bottom-end"
                                        content="A document aging is based on the RDS number or document. It indicates the number of years a document should be retained before it can be disposed of."
                                    >
                                        <div className="z-50 cursor-help">
                                            <Icon
                                                name="help"
                                                size={20}
                                                className="opacity-30 "
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
                                className="w-1/4 text-sm"
                                isDisabled={docs.length <= 1}
                            >
                                Remove
                            </Button>
                        </div>

                        {index + 1 !== docs.length && (
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
    );
};
