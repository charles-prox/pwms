import Input from "@/Components/Input";
import { ProfileFormData } from "@/Utils/types";
import { Card, CardBody } from "@heroui/react";
import React from "react";

// Define types for the props
interface ContactInfoProps {
    data: Record<string, any>;
    errors: Partial<Record<keyof ProfileFormData, string>>;
    setData: (field: string, value: string) => void;
    enableEdit: boolean;
}

export const ContactInfoForm: React.FC<ContactInfoProps> = ({
    data,
    errors,
    setData,
    enableEdit,
}) => {
    return (
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
                <h2 className="text-md font-bold">Contact Information</h2>
                <p className="text-sm text-default-500">
                    Keep your contact details up-to-date to ensure seamless
                    communication.
                </p>
            </div>
            <div className="col-span-12 md:col-span-8">
                <Card>
                    <CardBody className="p-0">
                        <div className="flex flex-col gap-5 p-8">
                            <Input
                                name={"email"}
                                label={"Email"}
                                labelPlacement="outside"
                                placeholder="e.g. juan.delacruz@example.com"
                                maxWidthClass={"max-w-lg"}
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                variant={enableEdit ? "bordered" : "flat"}
                                errorMessage={errors?.email}
                                isRequired
                            />

                            <Input
                                name={"contact_no"}
                                label={"Mobile Number"}
                                labelPlacement="outside"
                                placeholder="e.g. 09171234567"
                                maxWidthClass={"max-w-lg"}
                                value={data.contact_no}
                                onChange={(e) =>
                                    setData("contact_no", e.target.value)
                                }
                                variant={enableEdit ? "bordered" : "flat"}
                                errorMessage={errors?.contact_no}
                                isRequired
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
