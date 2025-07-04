import Icon from "@/Components/Icon";
import { searchBox } from "@/Services/searchBoxService";
import { BoxDetails, BoxFormState, ManageBoxDialogProps } from "@/Utils/types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    useDisclosure,
    Listbox,
    ListboxItem,
    Divider,
} from "@heroui/react";
import { div } from "framer-motion/client";
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export default function WithdrawalForm({
    editBoxId,
    triggerButton,
}: ManageBoxDialogProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery] = useDebounce(searchQuery, 500);
    const [boxes, setBoxes] = useState<BoxFormState[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );

    useEffect(() => {
        if (!debouncedQuery) {
            setBoxes([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const results: any = await searchBox.searchBoxes(
                    debouncedQuery
                );
                console.log("Search results:", results);

                setBoxes(results.data);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedQuery]);

    return (
        <>
            {triggerButton ? (
                React.cloneElement(triggerButton as React.ReactElement, {
                    onPress: () => {
                        setIsEditMode(true);
                        onOpen();
                    },
                })
            ) : (
                <Button
                    className="hidden sm:flex"
                    color="primary"
                    endContent={<Icon name="plus" size={20} />}
                    onPress={() => {
                        onOpen();
                    }}
                >
                    Add Box
                </Button>
            )}

            <Modal
                placement="top"
                backdrop="blur"
                size="4xl"
                hideCloseButton
                aria-label="Add Box"
                isDismissable={false}
                isKeyboardDismissDisabled
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Search Box to Withdraw
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        startContent={
                                            <Icon name="search-file" />
                                        }
                                        placeholder="Search by box code or title"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        isClearable
                                        onClear={() => {
                                            setSearchQuery("");
                                            setBoxes([]);
                                        }}
                                    />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-small text-default-500">
                                                Selected value: {selectedValue}
                                            </p>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                variant="light"
                                                onPress={() => {
                                                    setSelectedKeys(new Set());
                                                }}
                                            >
                                                Clear Selection
                                            </Button>
                                        </div>
                                        <Divider />
                                        {loading ? (
                                            <p className="text-center text-default-500">
                                                Loading...
                                            </p>
                                        ) : boxes.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                <Listbox
                                                    disallowEmptySelection
                                                    aria-label="Multiple selection example"
                                                    selectedKeys={selectedKeys}
                                                    selectionMode="multiple"
                                                    variant="flat"
                                                    onSelectionChange={(
                                                        keys
                                                    ) => {
                                                        setSelectedKeys(
                                                            new Set(
                                                                keys as Set<string>
                                                            )
                                                        );
                                                    }}
                                                    itemClasses={{
                                                        title: "font-bold",
                                                    }}
                                                >
                                                    {boxes.map((box) => (
                                                        <>
                                                            <ListboxItem
                                                                key={
                                                                    box.box_code
                                                                }
                                                                startContent={
                                                                    <Icon
                                                                        name="box"
                                                                        size={
                                                                            50
                                                                        }
                                                                    />
                                                                }
                                                                description={
                                                                    <div className="flex flex-col">
                                                                        {box.remarks && (
                                                                            <p className="text-default-700">
                                                                                Remarks:{" "}
                                                                                {
                                                                                    box.remarks
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {box.box_details.map(
                                                                            (
                                                                                detail: BoxDetails
                                                                            ) => (
                                                                                <div>
                                                                                    <p className="text-default-700">
                                                                                        Documents:{" "}
                                                                                    </p>
                                                                                    <span className="text-default-500 pl-3">
                                                                                        {
                                                                                            detail.document_title
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                }
                                                            >
                                                                {box.box_code}
                                                            </ListboxItem>
                                                        </>
                                                    ))}
                                                </Listbox>
                                            </div>
                                        ) : (
                                            <p className="text-center text-default-400">
                                                No results found.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
