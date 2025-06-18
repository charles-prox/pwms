import Input from "@/Components/Input";
import Select from "@/Components/Select";
import useFetch from "@/Hooks/useFetch";
import { employmentStatus } from "@/Utils/constants";
import { toTitleCase } from "@/Utils/helpers";
import { Office, ProfileFormData, Role, Position } from "@/Utils/types";
import { Card, CardBody } from "@heroui/react";
import { usePage } from "@inertiajs/react";
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
    } = useFetch<Office[]>(route("offices"));
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
                                onChange={(e) =>
                                    setData("hris_id", e.target.value)
                                }
                                errorMessage={errors.hris_id}
                                variant={enableEdit ? "bordered" : "flat"}
                                maxWidthClass="max-w-lg"
                                isRequired
                            />

                            <Select
                                autocomplete
                                name="office_id"
                                label="Office"
                                placeholder={
                                    loadingOffices
                                        ? "Loading offices..."
                                        : "e.g. Records Section, HR Department"
                                }
                                labelPlacement="outside"
                                items={offices}
                                maxWidthClass="max-w-lg"
                                selectedKeys={String(
                                    offices.find(
                                        (office: any) =>
                                            office.id === data.office_id
                                    )?.id || ""
                                )}
                                keyField="id"
                                labelField="name"
                                menuTrigger="input"
                                onSelectionChange={(key: string) => {
                                    setData("office_id", key);
                                }}
                                isClearable={false}
                                errorMessage={errors?.office_id || officesError}
                                isRequired
                            />

                            <Select
                                autocomplete
                                name="position"
                                label="Position"
                                placeholder={
                                    loadingPositions
                                        ? "Loading positions..."
                                        : "e.g. Administrative Officer II"
                                }
                                labelPlacement="outside"
                                items={positions}
                                keyField="id"
                                labelField="name"
                                menuTrigger="input"
                                selectedKeys={data.position}
                                onSelectionChange={(key) =>
                                    setData("position", key)
                                }
                                isClearable={false}
                                errorMessage={
                                    errors?.position || positionsError
                                }
                                maxWidthClass="max-w-lg"
                                isRequired
                            />

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
                                maxWidthClass="max-w-lg"
                                isRequired
                            />

                            <Select
                                autocomplete
                                name="role_id"
                                label="User Role"
                                placeholder="e.g. Administrator, Staff, Approver"
                                labelPlacement="outside"
                                items={roles} // e.g. [{label: 'Admin', value: 'admin'}, ...]
                                keyField="name"
                                labelField="name"
                                menuTrigger="input"
                                selectedKeys={data.role}
                                onSelectionChange={(key) =>
                                    setData("role", key)
                                }
                                maxWidthClass="max-w-lg"
                                isRequired
                                errorMessage={errors?.roles}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
