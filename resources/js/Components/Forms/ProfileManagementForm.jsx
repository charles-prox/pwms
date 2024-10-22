import React from "react";
import {
    Card,
    CardBody,
    Input,
    Avatar,
    Button,
    Divider,
    Autocomplete,
    AutocompleteItem,
    Spacer,
} from "@nextui-org/react";
import { router, useForm, usePage } from "@inertiajs/react";
import { toTitleCase, url } from "@/utils/helpers";
import Alert from "../Alert";
import { employmentStatus } from "@/utils/constants";
import ModalAlert from "../ModalAlert";
import Dropzone from "react-dropzone";

export const ProfileManagementForm = ({
    enableEdit,
    setEnableEdit,
    onSubmit,
    isProcessing,
}) => {
    const formRef = React.useRef(null);
    const { auth, offices } = usePage().props;
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [currentPhoto, setCurrentPhoto] = React.useState(null);
    const [dropError, setDropError] = React.useState("");
    const [fileName, setFileName] = React.useState("");
    const { data, setData, post, errors, processing, reset } = useForm({
        hris_id: "",
        user_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        position: "",
        contact_no: "",
        employment_status: "",
        office_id: "",
        account_status: "",
        photo: null,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("account.profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsAlertOpen(true);
                setEnableEdit(false);
            },
            onFinish: () => {},
        });
    };

    const handleFileChange = (files) => {
        if (files.length > 0) {
            const file = files[0];

            // Check file type
            if (!file.type.startsWith("image/")) {
                setDropError("Selected file is not an image.");
                return;
            }

            // Optionally check file size (e.g., limit to 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setDropError("File is too large.");
                return;
            }

            // console.log("Selected file:", file);
            // console.log("file name:", file.name);
            setFileName(file.name);
            setData("photo", file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentPhoto(reader.result); // Update state with the image URL
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
                setIsAlertOpen(true);
                setEnableEdit(false);
            },
        });
    };

    React.useEffect(() => {
        if (auth.user) {
            setData({
                hris_id: auth.user.hris_id || "",
                user_id: auth.user.user_id || "",
                first_name: auth.user.first_name || "",
                middle_name: auth.user.middle_name || "",
                last_name: auth.user.last_name || "",
                email: auth.user.email || "",
                position: auth.user.position || "",
                contact_no: auth.user.contact_no || "",
                employment_status: auth.user.employment_status || "",
                office_id: auth.user.office_id || "",
            });
        }
    }, [auth]);

    React.useEffect(() => {
        if (onSubmit) {
            if (formRef.current) {
                formRef.current.requestSubmit(); // Trigger form submission
            }
        }
    }, [onSubmit]);

    React.useEffect(() => {
        isProcessing(processing);
    }, [processing]);

    return (
        <React.Fragment>
            <ModalAlert
                isOpen={isAlertOpen}
                setIsAlertOpen={(state) => setIsAlertOpen(state)}
                type={"success"}
                autoClose={true}
            />

            <form ref={formRef} onSubmit={submit}>
                {Object.keys(errors).length !== 0 && (
                    <div>
                        <Spacer y={2} />
                        <Alert
                            type={"error"}
                            title={"Error updating profile information"}
                            message={
                                "We encountered some issues while saving your changes. Please check the highlighted fields for details."
                            }
                            variant={"flat"}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <h2 className="text-md font-bold">
                                User Information
                            </h2>
                            <p className="text-sm mx-w-">
                                Add additional security to your account using
                                two factor authentication.
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
                                                    (auth?.user
                                                        .profile_photo_path
                                                        ? url(
                                                              auth?.user
                                                                  .profile_photo_path
                                                          )
                                                        : auth?.user
                                                              .profile_photo_url)
                                                }
                                                className="min-w-36 min-h-36 text-large bg-transparent"
                                            />
                                            {enableEdit && (
                                                <div className="flex flex-col gap-1 items-center">
                                                    <Dropzone
                                                        onDrop={(files) =>
                                                            handleFileChange(
                                                                files
                                                            )
                                                        }
                                                        multiple={false}
                                                        onDropAccepted={() => {
                                                            setDropError("");
                                                        }}
                                                        onDropRejected={() => {
                                                            setDropError(
                                                                "The selected file is not a valid image."
                                                            );
                                                        }}
                                                        accept={{
                                                            "image/jpeg": [
                                                                ".jpeg",
                                                                ".jpg",
                                                            ],
                                                            "image/png": [
                                                                ".png",
                                                            ],
                                                        }}
                                                    >
                                                        {({
                                                            getRootProps,
                                                            getInputProps,
                                                        }) => (
                                                            <div className="container flex items-center justify-center max-w-md">
                                                                <div
                                                                    {...getRootProps(
                                                                        {
                                                                            className:
                                                                                "dropzone",
                                                                        }
                                                                    )}
                                                                    className={`border-3 border-dashed rounded-md p-5 hover:cursor-pointer ${
                                                                        errors
                                                                            .updateProfileInformation
                                                                            ?.photo ||
                                                                        (dropError &&
                                                                            "border-red-300")
                                                                    }`}
                                                                >
                                                                    <input
                                                                        {...getInputProps()}
                                                                    />
                                                                    <p className="text-sm text-center text-default-500">
                                                                        Drag and
                                                                        drop
                                                                        your
                                                                        image
                                                                        here, or
                                                                        click to
                                                                        select a
                                                                        file.
                                                                    </p>
                                                                    <p className="text-sm text-center text-default-500">
                                                                        Accepted
                                                                        formats:
                                                                        JPG,
                                                                        JPEG,
                                                                        PNG. Max
                                                                        file
                                                                        size:
                                                                        10MB.
                                                                    </p>
                                                                    {fileName && (
                                                                        <p className="text-sm text-center text-default-500 pt-2">
                                                                            Selected
                                                                            file:{" "}
                                                                            <span className="font-bold text-default-700">
                                                                                {
                                                                                    fileName
                                                                                }
                                                                            </span>
                                                                        </p>
                                                                    )}

                                                                    {(errors
                                                                        .updateProfileInformation
                                                                        ?.photo ||
                                                                        dropError) && (
                                                                        <p className="text-xs text-red-500 text-center pt-2">
                                                                            {dropError ||
                                                                                errors
                                                                                    .updateProfileInformation
                                                                                    ?.photo}
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
                                                        onPress={() =>
                                                            handleRemovePhoto()
                                                        }
                                                    >
                                                        Remove Photo
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <Input
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            label="First Name"
                                            labelPlacement="outside"
                                            value={data.first_name}
                                            isInvalid={
                                                !!errors
                                                    .updateProfileInformation
                                                    ?.first_name
                                            }
                                            errorMessage={
                                                errors.updateProfileInformation
                                                    ?.first_name
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "first_name",
                                                    e.target.value
                                                )
                                            }
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            variant={enableEdit && "bordered"}
                                            isRequired={enableEdit}
                                            isReadOnly={!enableEdit}
                                        />

                                        <Input
                                            type="text"
                                            name="middle_name"
                                            id="middle_name"
                                            label="Middle Name"
                                            labelPlacement="outside"
                                            value={data.middle_name}
                                            isInvalid={
                                                !!errors
                                                    .updateProfileInformation
                                                    ?.middle_name
                                            }
                                            errorMessage={
                                                errors.updateProfileInformation
                                                    ?.middle_name
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "middle_name",
                                                    e.target.value
                                                )
                                            }
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            variant={enableEdit && "bordered"}
                                            isRequired={enableEdit}
                                            isReadOnly={!enableEdit}
                                        />

                                        <Input
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            label="Last Name"
                                            labelPlacement="outside"
                                            value={data.last_name}
                                            isInvalid={
                                                !!errors
                                                    .updateProfileInformation
                                                    ?.last_name
                                            }
                                            errorMessage={
                                                errors.updateProfileInformation
                                                    ?.last_name
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            variant={enableEdit && "bordered"}
                                            isRequired={enableEdit}
                                            isReadOnly={!enableEdit}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <h2 className="text-md font-bold">
                                Contact Information
                            </h2>
                            <p className="text-sm mx-w-">
                                Add additional security to your account using
                                two factor authentication.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Card>
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-5 p-8">
                                        <Input
                                            type="text"
                                            name="email"
                                            id="email"
                                            label="Email"
                                            labelPlacement="outside"
                                            value={data.email}
                                            isInvalid={
                                                !!errors
                                                    .updateProfileInformation
                                                    ?.email
                                            }
                                            errorMessage={
                                                errors.updateProfileInformation
                                                    ?.email
                                            }
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            variant={enableEdit && "bordered"}
                                            isRequired={enableEdit}
                                            isReadOnly={!enableEdit}
                                        />

                                        <Input
                                            type="text"
                                            name="contact_no"
                                            id="contact_no"
                                            label="Mobile Number"
                                            labelPlacement="outside"
                                            value={data.contact_no}
                                            isInvalid={
                                                !!errors
                                                    .updateProfileInformation
                                                    ?.contact_no
                                            }
                                            errorMessage={
                                                errors.updateProfileInformation
                                                    ?.contact_no
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "contact_no",
                                                    e.target.value
                                                )
                                            }
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            variant={enableEdit && "bordered"}
                                            isRequired={enableEdit}
                                            isReadOnly={!enableEdit}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <h2 className="text-md font-bold">
                                Employment Details
                            </h2>
                            <p className="text-sm mx-w-">
                                Add additional security to your account using
                                two factor authentication.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Card>
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-5 p-8">
                                        <Input
                                            type="text"
                                            name="hris_id"
                                            id="hris_id"
                                            label="HRIS ID"
                                            labelPlacement="outside"
                                            value={data.hris_id}
                                            isInvalid={
                                                !!errors
                                                    .updateProfileInformation
                                                    ?.hris_id
                                            }
                                            errorMessage={
                                                errors.updateProfileInformation
                                                    ?.hris_id
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "hris_id",
                                                    e.target.value
                                                )
                                            }
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            variant={enableEdit && "bordered"}
                                            isRequired={enableEdit}
                                            isReadOnly={!enableEdit}
                                        />

                                        {!enableEdit ? (
                                            <Input
                                                type="text"
                                                name="office_id"
                                                id="office_id"
                                                label="Office"
                                                labelPlacement="outside"
                                                value={
                                                    offices.find(
                                                        (office) =>
                                                            office.id ===
                                                            data.office_id
                                                    )?.name || ""
                                                }
                                                classNames={{
                                                    label: "text-black dark:text-white/90 font-bold",
                                                    inputWrapper:
                                                        "border-slate-400",
                                                    base: "max-w-lg",
                                                }}
                                                isReadOnly={!enableEdit}
                                            />
                                        ) : (
                                            <Autocomplete
                                                name="office_id"
                                                id="office_id"
                                                defaultItems={offices}
                                                selectedKey={data.office_id.toString()}
                                                label="Office"
                                                placeholder="Enter your office department/section/office"
                                                labelPlacement="outside"
                                                variant="bordered"
                                                inputProps={{
                                                    classNames: {
                                                        label: "text-black dark:text-white/90 font-bold",
                                                        inputWrapper:
                                                            "border-slate-400",
                                                        base: "max-w-lg",
                                                    },
                                                }}
                                                isClearable={false}
                                                className="min-w-64"
                                                menuTrigger="input"
                                                onSelectionChange={(key) => {
                                                    setData("office_id", key);
                                                }}
                                                onKeyDown={(e) =>
                                                    e.continuePropagation()
                                                } //to stop console error: console.js:213 stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.
                                                isRequired={enableEdit}
                                                isInvalid={
                                                    !!errors
                                                        .updateProfileInformation
                                                        ?.office_id
                                                }
                                                errorMessage={
                                                    errors
                                                        .updateProfileInformation
                                                        ?.office_id
                                                }
                                                isReadOnly={!enableEdit}
                                            >
                                                {(office) => (
                                                    <AutocompleteItem
                                                        key={office.id}
                                                    >
                                                        {office.name}
                                                    </AutocompleteItem>
                                                )}
                                            </Autocomplete>
                                        )}

                                        <Input
                                            type="text"
                                            name="position"
                                            id="position"
                                            label="Position"
                                            labelPlacement="outside"
                                            value={data.position}
                                            isInvalid={
                                                !!errors
                                                    .updateProfileInformation
                                                    ?.position
                                            }
                                            errorMessage={
                                                errors.updateProfileInformation
                                                    ?.position
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            variant={enableEdit && "bordered"}
                                            isRequired={enableEdit}
                                            isReadOnly={!enableEdit}
                                        />

                                        {enableEdit ? (
                                            <Autocomplete
                                                name="employment_status"
                                                id="employment_status"
                                                defaultItems={employmentStatus}
                                                selectedKey={data.employment_status?.toString()}
                                                label="Employment Status"
                                                labelPlacement="outside"
                                                placeholder="Current employment status"
                                                variant="bordered"
                                                inputProps={{
                                                    classNames: {
                                                        label: "text-black dark:text-white/90 font-bold",
                                                        inputWrapper:
                                                            "border-slate-400",
                                                        base: "max-w-lg",
                                                    },
                                                }}
                                                isClearable={false}
                                                className="min-w-64"
                                                menuTrigger="input"
                                                onSelectionChange={(key) => {
                                                    setData(
                                                        "employment_status",
                                                        key
                                                    );
                                                }}
                                                onKeyDown={(e) =>
                                                    e.continuePropagation()
                                                } //to stop console error: console.js:213 stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.
                                                isRequired
                                                isInvalid={
                                                    !!errors
                                                        .updateProfileInformation
                                                        ?.employment_status
                                                }
                                                errorMessage={
                                                    errors
                                                        .updateProfileInformation
                                                        ?.employment_status
                                                }
                                            >
                                                {(empstat) => (
                                                    <AutocompleteItem
                                                        key={empstat.value}
                                                    >
                                                        {empstat.label}
                                                    </AutocompleteItem>
                                                )}
                                            </Autocomplete>
                                        ) : (
                                            <Input
                                                type="text"
                                                label="Employment Status"
                                                labelPlacement="outside"
                                                value={toTitleCase(
                                                    data.employment_status
                                                )}
                                                classNames={{
                                                    label: "text-black dark:text-white/90 font-bold",
                                                    inputWrapper:
                                                        "border-slate-400",
                                                    base: "max-w-lg",
                                                }}
                                                isReadOnly
                                            />
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
};
