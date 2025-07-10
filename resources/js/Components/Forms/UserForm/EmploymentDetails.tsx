import Input from "@/Components/Input";
import Select from "@/Components/Select";
import useFetch from "@/Hooks/useFetch";
import { employmentStatus } from "@/Utils/constants";
import { toTitleCase } from "@/Utils/helpers";
import { Office, ProfileFormData, Role, Position } from "@/Utils/types";
import { Card, CardBody, Skeleton, Switch } from "@heroui/react";
import { usePage } from "@inertiajs/react";
import React from "react";

interface EmploymentDetailsFormProps {
    data: Record<string, any>;
    errors: Partial<Record<keyof ProfileFormData, string>>;
    setData: (field: string, value: string | number) => void;
    clearErrors: (field: string) => void;
    isEditable: boolean;
}

export const EmploymentDetailsForm: React.FC<EmploymentDetailsFormProps> = ({
    data,
    errors,
    setData,
    clearErrors,
    isEditable,
}) => {
    const {
        data: offices,
        loading: loadingOffices,
        error: officesError,
    } = useFetch<Office[]>(route("offices.list"));
    const {
        data: positions,
        loading: loadingPositions,
        error: positionsError,
    } = useFetch<Position[]>(route("positions"));

    const { roles } = usePage<{ roles: Role[] }>().props;

    return (
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
                <h2 className="text-md font-bold">Employment Details</h2>
                <p className="text-sm text-default-500">
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
                                placeholder="e.g. 30731022"
                                value={data.hris_id}
                                onChange={(e) => {
                                    clearErrors("hris_id");
                                    setData("hris_id", e.target.value);
                                }}
                                errorMessage={errors.hris_id}
                                variant={isEditable ? "bordered" : "flat"}
                                maxWidthClass="max-w-lg"
                                isRequired
                                isDisabled={!isEditable}
                            />

                            {!loadingOffices ? (
                                <Select
                                    autocomplete
                                    name="office_id"
                                    label="Office"
                                    placeholder="e.g. Records Section, HR Department"
                                    labelPlacement="outside"
                                    items={offices}
                                    maxWidthClass="max-w-lg"
                                    selectedKeys={data.office_id}
                                    keyField="id"
                                    labelField="name"
                                    menuTrigger="input"
                                    onSelectionChange={(key: string) => {
                                        clearErrors("office_id");
                                        setData("office_id", key);
                                    }}
                                    isClearable={false}
                                    errorMessage={
                                        errors?.office_id || officesError
                                    }
                                    isRequired
                                    isReadOnly={!isEditable}
                                />
                            ) : (
                                <Skeleton className="h-10 max-w-lg rounded-lg" />
                            )}

                            {!loadingPositions ? (
                                <Select
                                    autocomplete
                                    name="position"
                                    label="Position"
                                    placeholder="e.g. Administrative Officer II"
                                    labelPlacement="outside"
                                    items={positions}
                                    keyField="id"
                                    labelField="name"
                                    menuTrigger="input"
                                    selectedKeys={data.position}
                                    onSelectionChange={(key) => {
                                        clearErrors("position");
                                        setData("position", key);
                                    }}
                                    isClearable={false}
                                    errorMessage={
                                        errors?.position || positionsError
                                    }
                                    maxWidthClass="max-w-lg"
                                    isRequired
                                    isReadOnly={!isEditable}
                                />
                            ) : (
                                <Skeleton className="h-10 max-w-lg rounded-lg" />
                            )}

                            <Select
                                autocomplete
                                name="employment_status"
                                label="Employment Status"
                                placeholder="e.g. Regular, Job Order, Casual"
                                labelPlacement="outside"
                                items={employmentStatus}
                                keyField="value"
                                labelField="label"
                                menuTrigger="input"
                                selectedKeys={data.employment_status}
                                onSelectionChange={(key: string) => {
                                    clearErrors("employment_status");
                                    setData("employment_status", key);
                                }}
                                isClearable={false}
                                errorMessage={errors?.employment_status}
                                maxWidthClass="max-w-lg"
                                isRequired
                                isReadOnly={!isEditable}
                            />

                            {!!roles && (
                                <>
                                    <Select
                                        autocomplete
                                        name="role"
                                        label="User Role"
                                        placeholder="e.g. Administrator, Staff, Approver"
                                        labelPlacement="outside"
                                        items={roles}
                                        keyField="name"
                                        labelField="name"
                                        menuTrigger="input"
                                        selectedKeys={data.role}
                                        onSelectionChange={(key) => {
                                            clearErrors("role");
                                            setData("role", key);
                                        }}
                                        maxWidthClass="max-w-lg"
                                        isRequired
                                        errorMessage={errors?.role}
                                        isReadOnly={!isEditable}
                                    />
                                    <div>
                                        <p className="font-bold text-sm mb-2">
                                            Account Status{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </p>
                                        <Switch
                                            isSelected={
                                                data.account_status === "active"
                                            }
                                            onValueChange={(isSelected) => {
                                                console.log(isSelected);

                                                setData(
                                                    "account_status",
                                                    isSelected
                                                        ? "active"
                                                        : "inactive"
                                                );
                                            }}
                                            classNames={{
                                                label: "text-sm",
                                            }}
                                        >
                                            {toTitleCase(data.account_status)}
                                        </Switch>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
