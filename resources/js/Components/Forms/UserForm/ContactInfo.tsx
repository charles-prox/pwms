import Input from "@/Components/Input";
import { ProfileFormData } from "@/Utils/types";
import { Card, CardBody } from "@heroui/react";
import React from "react";

interface ContactInfoFormProps {
    data: Record<string, any>;
    errors: Partial<Record<keyof ProfileFormData, string>>;
    setData: (field: keyof ProfileFormData, value: string) => void;
    clearErrors: (key: string) => void;
    isEditable: boolean;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
    data,
    errors,
    setData,
    clearErrors,
    isEditable,
}) => {
    return (
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
                <h2 className="text-md font-bold">Contact Information</h2>
                <p className="text-sm">
                    Keep your contact details up-to-date to ensure seamless
                    communication.
                </p>
            </div>

            <div className="col-span-12 md:col-span-8">
                <Card>
                    <CardBody className="p-0">
                        <div className="flex flex-col gap-5 p-8">
                            <Input
                                name="email"
                                label="Email"
                                labelPlacement="outside"
                                placeholder="e.g. juan.delacruz@example.com"
                                maxWidthClass="max-w-lg"
                                value={data.email}
                                onChange={(e) => {
                                    clearErrors("email");
                                    setData("email", e.target.value);
                                }}
                                variant={isEditable ? "bordered" : "flat"}
                                errorMessage={errors.email}
                                isReadOnly={!isEditable}
                                isRequired={isEditable}
                            />

                            <Input
                                name="contact_no"
                                label="Mobile Number"
                                labelPlacement="outside"
                                placeholder="e.g. 09171234567"
                                maxWidthClass="max-w-lg"
                                value={data.contact_no}
                                onChange={(e) => {
                                    clearErrors("contact_no");
                                    setData("contact_no", e.target.value);
                                }}
                                variant={isEditable ? "bordered" : "flat"}
                                errorMessage={errors.contact_no}
                                isReadOnly={!isEditable}
                                isRequired={isEditable}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
