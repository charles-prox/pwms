import React, { useState } from "react";
import { url } from "@/Utils/helpers";
import { router } from "@inertiajs/react";
import { Avatar, Button, Card, CardBody } from "@heroui/react";
import Dropzone, { FileRejection } from "react-dropzone";
import Input from "@/Components/Input";
import { useModalAlert } from "@/Contexts/ModalAlertContext";
import { ProfileFormData, UserType } from "@/Utils/types";

interface UserInfoFormProps {
    user?: UserType;
    isEditable: boolean;
    setData: (key: string, value: any) => void;
    clearErrors: (key: string) => void;
    errors: Partial<Record<keyof ProfileFormData, string>>;
    data: Record<string, any>;
    reset: () => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({
    user,
    isEditable,
    setData,
    clearErrors,
    errors,
    data,
    reset,
}) => {
    const [dropError, setDropError] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
    const { showAlert } = useModalAlert();

    const handleFileChange = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];

            if (!file.type.startsWith("image/")) {
                setDropError("Selected file is not an image.");
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setDropError("File is too large.");
                return;
            }

            setFileName(file.name);
            setData("photo", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setDropError("No file selected.");
        }
    };

    const handleRemovePhoto = () => {
        router.delete(route("current-user-photo.destroy"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                showAlert({
                    type: "success",
                    title: "Profile photo removed",
                    message:
                        "Your profile picture has been deleted successfully.",
                    autoClose: true,
                    autoCloseDuration: 3000,
                });
            },
        });
    };

    return (
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-4">
                <h2 className="text-md font-bold">User Information</h2>
                <p className="text-sm">
                    Manage and update your personal information for a complete
                    profile.
                </p>
            </div>
            <div className="col-span-12 md:col-span-8">
                <Card>
                    <CardBody className="p-0">
                        <div className="flex flex-col gap-5 p-8">
                            <div className="flex gap-3 items-center">
                                <Avatar
                                    src={
                                        currentPhoto ||
                                        (user?.profile_photo_path
                                            ? url(user.profile_photo_path)
                                            : user?.profile_photo_url)
                                    }
                                    fallback={
                                        user
                                            ? user.first_name[0] +
                                              user.last_name[0]
                                            : "U"
                                    }
                                    className={`min-w-36 min-h-36 text-[5rem] ${
                                        currentPhoto || user?.profile_photo_path
                                            ? "bg-transparent"
                                            : `bg-[#EBF4FF] dark:bg-[#7F9CF5]`
                                    } text-[#7F9CF5] dark:text-[#EBF4FF]`}
                                />

                                {isEditable && (
                                    <div className="flex flex-col gap-1 items-center">
                                        <Dropzone
                                            onDrop={handleFileChange}
                                            multiple={false}
                                            onDropAccepted={() => {
                                                setDropError("");
                                            }}
                                            onDropRejected={(
                                                _: FileRejection[]
                                            ) => {
                                                setDropError(
                                                    "The selected file is not a valid image."
                                                );
                                            }}
                                            accept={{
                                                "image/jpeg": [".jpeg", ".jpg"],
                                                "image/png": [".png"],
                                            }}
                                        >
                                            {({
                                                getRootProps,
                                                getInputProps,
                                            }) => (
                                                <div className="container flex items-center justify-center max-w-md">
                                                    <div
                                                        {...getRootProps({
                                                            className:
                                                                "dropzone",
                                                        })}
                                                        className={`border-3 border-dashed rounded-md p-5 hover:cursor-pointer ${
                                                            errors?.photo ||
                                                            dropError
                                                                ? "border-red-300"
                                                                : ""
                                                        }`}
                                                    >
                                                        <input
                                                            {...getInputProps()}
                                                        />
                                                        <p className="text-sm text-center text-default-500">
                                                            Drag and drop your
                                                            image here, or click
                                                            to select a file.
                                                        </p>
                                                        <p className="text-sm text-center text-default-500">
                                                            Accepted: JPG, JPEG,
                                                            PNG. Max: 5MB.
                                                        </p>
                                                        {fileName && (
                                                            <p className="text-sm text-center text-default-500 pt-2">
                                                                Selected file:{" "}
                                                                <span className="font-bold text-default-700">
                                                                    {fileName}
                                                                </span>
                                                            </p>
                                                        )}

                                                        {(errors?.photo ||
                                                            dropError) && (
                                                            <p className="text-xs text-red-500 text-center pt-2">
                                                                {dropError ||
                                                                    errors.photo}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>

                                        <p className="text-xs text-default-500">
                                            or
                                        </p>

                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            className="max-w-36"
                                            onPress={handleRemovePhoto}
                                        >
                                            Remove Photo
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Text Inputs */}
                            {[
                                {
                                    id: "first_name",
                                    label: "First Name",
                                    placeholder: "e.g. Juan",
                                },
                                {
                                    id: "middle_name",
                                    label: "Middle Name",
                                    placeholder: "e.g. Santos",
                                },
                                {
                                    id: "last_name",
                                    label: "Last Name",
                                    placeholder: "e.g. Dela Cruz",
                                },
                                {
                                    id: "user_id",
                                    label: "User ID",
                                    placeholder: "e.g. user123",
                                },
                            ].map(({ id, label, placeholder }) => (
                                <Input
                                    key={id}
                                    name={id}
                                    label={label}
                                    labelPlacement="outside"
                                    placeholder={placeholder}
                                    maxWidthClass="max-w-lg"
                                    value={data[id] || ""}
                                    onChange={(e) => {
                                        clearErrors(id);
                                        setData(id, e.target.value);
                                    }}
                                    variant={isEditable ? "bordered" : "flat"}
                                    errorMessage={errors[id]}
                                    isReadOnly={!isEditable}
                                    isRequired={id !== "middle_name"}
                                />
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
