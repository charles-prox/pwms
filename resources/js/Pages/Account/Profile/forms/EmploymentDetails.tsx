import Input from "@/Components/Shared/Input";
import Select from "@/Components/Shared/Select";
import useFetch from "@/Hooks/useFetch";
import { employmentStatus } from "@/Utils/constants";
import { toTitleCase } from "@/Utils/helpers";
import { ProfileFormData } from "@/Utils/types";
import { Card, CardBody } from "@heroui/react";
import React from "react";

// Define types for the props
interface EmploymentDetailsFormProps {
    data: Record<string, any>;
    errors: Partial<Record<keyof ProfileFormData, string>>;
    setData: (field: string, value: string | number) => void;
    enableEdit: boolean;
}

export const EmploymentDetailsForm: React.FC<EmploymentDetailsFormProps> = ({
    data,
    errors,
    setData,
    enableEdit,
}) => {
    const {
        data: offices,
        loading: loadingOffices,
        error: officesError,
    } = useFetch<any[]>(route("offices"));

    return (
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
                <h2 className="text-md font-bold">Employment Details</h2>
                <p className="text-sm mx-w-">
                    Manage your position, department, status, and key employment
                    details here.
                </p>
            </div>
            <div className="col-span-12 md:col-span-8">
                <Card>
                    <CardBody className="p-0">
                        <div className="flex flex-col gap-5 p-8">
                            <Input
                                name="hris_id"
                                label="HRIS ID"
                                labelPlacement="outside"
                                placeholder="Enter your HRIS ID"
                                value={data.hris_id}
                                onChange={(e) =>
                                    setData("hris_id", e.target.value)
                                }
                                errorMessage={errors.hris_id}
                                variant={enableEdit ? "bordered" : "flat"}
                                maxWidthClass={"max-w-lg"}
                                isRequired={enableEdit}
                                isReadOnly={!enableEdit}
                            />

                            {!enableEdit ? (
                                <Input
                                    name="office_id"
                                    label="Office"
                                    labelPlacement="outside"
                                    placeholder="Select an Office"
                                    maxWidthClass={"max-w-lg"}
                                    value={
                                        offices.find(
                                            (office: any) =>
                                                office.id === data.office_id
                                        )?.name || ""
                                    }
                                    variant={enableEdit ? "bordered" : "flat"}
                                    isReadOnly
                                />
                            ) : (
                                <Select
                                    autocomplete
                                    name="office_id"
                                    label="Office"
                                    placeholder={
                                        loadingOffices
                                            ? "Loading offices..."
                                            : "Enter your office department/section/office"
                                    }
                                    labelPlacement="outside"
                                    items={offices}
                                    maxWidthClass={"max-w-lg"}
                                    selectedKeys={String(
                                        offices.find(
                                            (office: any) =>
                                                office.id === data.office_id
                                        )?.id || ""
                                    )}
                                    keyField={"id"}
                                    labelField="name"
                                    menuTrigger="input"
                                    onSelectionChange={(key: string) => {
                                        setData("office_id", key);
                                    }}
                                    isClearable={false}
                                    errorMessage={
                                        errors?.office_id || officesError
                                    }
                                    isRequired
                                />
                            )}

                            <Input
                                name="position"
                                label="Position"
                                labelPlacement="outside"
                                placeholder="Enter your position"
                                value={data.position}
                                variant={enableEdit ? "bordered" : "flat"}
                                isReadOnly={!enableEdit}
                                onChange={(e) =>
                                    setData("position", e.target.value)
                                }
                                errorMessage={errors?.position}
                                maxWidthClass={"max-w-lg"}
                            />

                            {enableEdit ? (
                                <Select
                                    autocomplete
                                    name="employment_status"
                                    label="Employment Status"
                                    placeholder="Current employment status"
                                    labelPlacement="outside"
                                    items={employmentStatus}
                                    keyField={"value"}
                                    labelField="label"
                                    menuTrigger="input"
                                    selectedKeys={String(
                                        employmentStatus.find(
                                            (stat: any) =>
                                                stat.value ===
                                                data.employment_status
                                        )?.value || ""
                                    )}
                                    onSelectionChange={(key: string) => {
                                        setData("employment_status", key);
                                    }}
                                    isClearable={false}
                                    errorMessage={errors?.employment_status}
                                    maxWidthClass={"max-w-lg"}
                                    isRequired
                                />
                            ) : (
                                <Input
                                    name="employment_status"
                                    label="Employment Status"
                                    labelPlacement="outside"
                                    placeholder="Enter your employee status"
                                    value={toTitleCase(data.employment_status)}
                                    variant={enableEdit ? "bordered" : "flat"}
                                    isReadOnly={!enableEdit}
                                    onChange={(e) =>
                                        setData("position", e.target.value)
                                    }
                                    errorMessage={errors?.position}
                                    maxWidthClass={"max-w-lg"}
                                />
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
