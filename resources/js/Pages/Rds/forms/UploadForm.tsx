import { axiosInstance } from "@/Utils/axios";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Spacer,
    Progress,
} from "@heroui/react";
import { router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import React from "react";

interface ImportFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportForm({ isOpen, onClose }: ImportFormProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(
        null
    );

    const { data, setData, progress, reset } = useForm<{
        file: File | null;
    }>({
        file: null,
    });

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!data.file) {
            setErrorMessage("Please select a file.");
            return;
        }

        if (data.file.type !== "text/csv") {
            setErrorMessage("Invalid file type. Please import a CSV file.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", data.file);

        try {
            const response = await axiosInstance.post("/rds/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage(
                response.data.message || "File imported successfully!"
            );
            reset(); // Clears the file input
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message || "An error occurred."
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        reset(); // Reset the form data when closing the modal
        setErrorMessage(null);
        setSuccessMessage(null);
        onClose(); // Call the parent onClose function
        router.reload(); // Optionally reload the page to reflect changes
    };

    return (
        <Modal
            backdrop="blur"
            size="lg"
            isOpen={isOpen}
            onClose={handleClose}
            autoFocus={false}
        >
            <ModalContent>
                <form onSubmit={submit} autoFocus={false}>
                    <ModalHeader
                        autoFocus={false}
                        className="flex flex-col gap-1"
                    >
                        Import File
                    </ModalHeader>
                    <ModalBody autoFocus={false}>
                        <p className="text-sm text-gray-600">
                            Please import a <strong>CSV file</strong> containing
                            records that follow the required format.
                        </p>
                        <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
                            <li>
                                <strong>module</strong> (1 character, required)
                                - Example: "A"
                            </li>
                            <li>
                                <strong>item_no</strong> (required) - Example:
                                "1.1"
                            </li>
                            <li>
                                <strong>title_description</strong> (required) -
                                Description of the item
                            </li>
                            <li>
                                <strong>active</strong> (required)- Example: "5"
                            </li>
                            <li>
                                <strong>storage</strong> (required)- Example:
                                "10"
                            </li>
                            <li>
                                <strong>remarks</strong> (optional) - Any
                                additional information
                            </li>
                            <li>
                                <strong>department</strong> (required) -
                                Example: "Finance"
                            </li>
                        </ul>
                        <p className="mt-4 text-sm text-gray-700 ">
                            <strong>Note:</strong> Ensure the file headers match
                            exactly. Incorrect formatting may result in errors.
                        </p>
                        <Spacer y={5} />

                        {errorMessage && (
                            <p className="text-sm text-red-500">
                                {errorMessage}
                            </p>
                        )}
                        {successMessage && (
                            <p className="text-sm text-green-500">
                                {successMessage}
                            </p>
                        )}

                        <Input
                            autoFocus={false}
                            type="file"
                            accept=".csv"
                            isRequired
                            name="file"
                            label="Please choose a file"
                            labelPlacement="outside"
                            isDisabled={isLoading}
                            onChange={(e) => {
                                setErrorMessage(null);
                                setSuccessMessage(null);
                                if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                ) {
                                    setData("file", e.target.files[0]);
                                }
                            }}
                        />
                        <Progress
                            aria-label="Importing..."
                            className={`max-w-md ${
                                progress ? "visible" : "invisible"
                            }`}
                            color="success"
                            showValueLabel={true}
                            size="sm"
                            value={progress?.percentage}
                            autoFocus={false}
                        />
                    </ModalBody>

                    <ModalFooter autoFocus={false}>
                        <Button
                            color="default"
                            variant="light"
                            onPress={handleClose}
                            isDisabled={isLoading}
                            autoFocus={false}
                        >
                            Close
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            isLoading={isLoading}
                            isDisabled={!data.file}
                            autoFocus={false}
                        >
                            Import
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
