import { BoxFormContext } from "@/Contexts/BoxFormContext";
import React from "react";
import dayjs from "dayjs";
import {
    BoxDetails,
    BoxFormState,
    BoxDate,
    BoxDateRange,
    PriorityLevel,
} from "@/Utils/types";
import { useState } from "react";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import useRdsData from "@/Hooks/useRdsData";

const generateDocumentCode = () => {
    const timestamp = Date.now().toString(36); // shorter base36 version of timestamp
    const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase(); // random alphanumeric
    return `DOC-${timestamp}-${randomPart}`;
};
export const BoxFormProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const {
        rdsData,
        loading: rdsLoading,
        error: rdsError,
        getRdsDetailsById,
    } = useRdsData({ fetchAll: true });
    const [boxes, setBoxes] = useState<BoxFormState[]>(() => {
        const storedBoxes = localStorage.getItem("boxes");
        return storedBoxes ? JSON.parse(storedBoxes) : [];
    });

    const [boxData, setBoxData] = useState<BoxFormState>({
        id: 1,
        box_code: "",
        priority_level: null,
        remarks: null,
        disposal_date: {
            raw: null,
            formatted: null,
        },
        office: null,
        box_details: [
            {
                id: null,
                document_code: generateDocumentCode(),
                document_title: null,
                rds_number: "",
                retention_period: "",
                document_date: {
                    start: {
                        raw: null,
                        formatted: null,
                    },
                    end: {
                        raw: null,
                        formatted: null,
                    },
                    readable: null,
                },
                disposal_date: {
                    raw: null,
                    formatted: null,
                },
            },
        ],
    });

    const [errors, setErrors] = useState<any>({
        id: null,
        box_code: "",
        priority_level: "",
        office: "",
        remarks: "",
        disposal_date: "",
        box_details: [
            {
                id: null,
                document_title: "",
                rds_number: "",
                retention_period: "",
                document_date: "",
                disposal_date: "",
            },
        ],
    });

    const getBoxById = (idToFind: number): BoxFormState => {
        const box = boxes.find((box) => box.id === idToFind);
        if (!box) {
            throw new Error(`Box with id ${idToFind} not found`);
        }
        return box;
    };

    const editBox = (updatedBox: BoxFormState): boolean => {
        // console.log("UpdatedBox: ", updatedBox);

        const { hasError, errors } = validateBoxData(updatedBox);

        if (hasError) {
            setErrors(errors);
            // console.error("Validation errors:", errors);
            return true;
        }

        const updatedBoxes = boxes.map((box) =>
            box.id === updatedBox.id ? updatedBox : box
        );

        setBoxes(updatedBoxes);
        localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
        resetBoxData();

        return false;
    };

    const deleteBox = (idToDelete: number) => {
        setBoxes((prevBoxes) => {
            const updatedBoxes = prevBoxes.filter(
                (box) => box.id !== idToDelete
            );
            localStorage.setItem("boxes", JSON.stringify(updatedBoxes));
            return updatedBoxes;
        });
    };

    const resetBoxes = () => {
        setBoxes([]);
        localStorage.removeItem("boxes");
    };

    const resetBoxData = () => {
        const initialData: BoxFormState = {
            id: 1,
            box_code: "",
            priority_level: null,
            remarks: "",
            disposal_date: null, // should match BoxFormState type
            office: null,
            box_details: [
                {
                    id: null,
                    document_code: generateDocumentCode(),
                    document_title: null,
                    rds_number: "",
                    retention_period: "",
                    document_date: {
                        start: { raw: null, formatted: null },
                        end: { raw: null, formatted: null },
                        readable: null,
                    },
                    disposal_date: {
                        raw: null,
                        formatted: null,
                    },
                },
            ],
        };

        const initialErrors = {
            id: null,
            box_code: "",
            priority_level: "",
            remarks: "",
            disposal_date: "",
            office: "",
            box_details: [
                {
                    id: null,
                    document_title: "",
                    rds_number: "",
                    retention_period: "",
                    document_date: "",
                    disposal_date: "",
                },
            ],
        };

        setBoxData(initialData);
        setErrors(initialErrors);
    };

    const formatDateRange = (
        dateRange: RangeValue<DateValue> | null
    ): BoxDateRange => {
        if (!dateRange || !dateRange.start) {
            return { start: null, end: null, readable: null };
        }

        const startDate = dayjs(dateRange.start.toDate("UTC"));
        const endDate = dateRange.end
            ? dayjs(dateRange.end.toDate("UTC"))
            : startDate;

        const startRaw = startDate.format("YYYY-MM-DD");
        const endRaw = endDate.format("YYYY-MM-DD");

        const startFormatted = startDate.format("MMMM D, YYYY");
        const endFormatted = endDate.format("MMMM D, YYYY");

        let readable: string;

        if (startDate.isSame(endDate, "year")) {
            if (startDate.isSame(endDate, "month")) {
                if (startDate.isSame(endDate, "day")) {
                    readable = startFormatted;
                } else {
                    readable = `${startDate.format("MMMM D")}-${endDate.format(
                        "D, YYYY"
                    )}`;
                }
            } else {
                readable = `${startDate.format("MMMM D")} - ${endDate.format(
                    "MMMM D, YYYY"
                )}`;
            }
        } else {
            readable = `${startFormatted} - ${endFormatted}`;
        }

        return {
            start: {
                raw: startRaw,
                formatted: startFormatted,
            },
            end: {
                raw: endRaw,
                formatted: endFormatted,
            },
            readable: readable,
        };
    };

    const parseDateRange = (
        dateRange: BoxDateRange | null
    ): RangeValue<DateValue> | null => {
        if (!dateRange || !dateRange.start?.raw) return null;

        const toCalendarDate = (raw: string | null): CalendarDate | null => {
            if (!raw) return null;
            const [year, month, day] = raw.split("-").map(Number);
            return new CalendarDate(year, month, day);
        };

        const start = toCalendarDate(dateRange.start.raw);
        const end = toCalendarDate(dateRange.end?.raw ?? dateRange.start.raw);

        return start ? { start, end: end ?? start } : null;
    };

    // const extractLatestDate = (dateStr: string) => {
    //     if (!dateStr) return null;
    //     const dates = dateStr
    //         .split(" to ")
    //         .map((d) => dayjs(d.trim(), "YYYY-MM-DD", true));
    //     return dates.length > 1 ? dates[1] : dates[0];
    // };

    const calculateDocumentDisposalDate = (
        documentDate: BoxDateRange | null,
        retentionPeriod: string | number
    ): BoxDate | "Permanent" => {
        const period = String(retentionPeriod).toLowerCase();

        if (period === "permanent") {
            return { raw: "Permanent", formatted: "Permanent" };
        }

        if (!documentDate || !documentDate.end?.raw) {
            return { raw: null, formatted: null };
        }

        const endDate = dayjs(documentDate.end.raw);
        const retentionYears = parseInt(period, 10);

        if (!endDate.isValid() || isNaN(retentionYears)) {
            return { raw: null, formatted: null };
        }

        const disposalDay = endDate.add(retentionYears, "year");

        return {
            raw: disposalDay.format("YYYY-MM-DD"),
            formatted: disposalDay.format("MMMM D, YYYY"),
        };
    };

    const updateBoxDisposalDate = (updatedBoxDetails: BoxDetails[]) => {
        // Check if any disposal_date is the string "Permanent"

        const hasPermanent = updatedBoxDetails.some(
            (doc) => doc.retention_period === "Permanent"
        );

        if (hasPermanent) {
            return {
                disposalDate: "Permanent" as const,
                priorityLevel: { value: "red", label: "RED (Permanent Files)" },
            };
        }

        // Extract disposal_date.raw strings and parse with dayjs
        const validDates = updatedBoxDetails
            .map((doc) => {
                if (
                    doc.disposal_date !== null &&
                    doc.disposal_date !== "Permanent" &&
                    doc.disposal_date.raw !== null
                ) {
                    return dayjs(doc.disposal_date.raw);
                }
                return null;
            })
            .filter(
                (date): date is dayjs.Dayjs => date !== null && date.isValid()
            );

        if (validDates.length === 0) {
            return {
                disposalDate: null,
                priorityLevel: null,
            };
        }

        // Find the latest date
        const latestDate = validDates.reduce((latest, current) =>
            current.isAfter(latest) ? current : latest
        );

        // Add one year and format
        const disposalDate: BoxDate = {
            raw: latestDate.add(1, "year").toISOString(), // ISO string for raw value
            formatted: latestDate.add(1, "year").format("MMMM YYYY"), // formatted string
        };

        // Calculate max retention period
        const maxRetention = updatedBoxDetails.reduce((max, doc) => {
            const years = parseInt(doc.retention_period, 10);
            return !isNaN(years) && years > max ? years : max;
        }, 0);

        let priorityLevel: PriorityLevel | null = null;
        if (maxRetention >= 3) {
            priorityLevel = {
                value: "green",
                label: "GREEN (3 years above retention period)",
            };
        } else if (maxRetention >= 1) {
            priorityLevel = {
                value: "black",
                label: "BLACK (1-2 years retention period or photocopied documents)",
            };
        }

        return { disposalDate, priorityLevel };
    };

    const onDocumentChange = (
        index: number,
        field: keyof BoxDetails,
        value: RangeValue<DateValue> | string | null
    ) => {
        setBoxData((prev) => {
            const updatedDocuments = [...prev.box_details];

            // Helper to format date range (returns BoxDateRange)
            const formattedDate = formatDateRange(
                value as RangeValue<DateValue>
            );

            if (field === "id" && typeof value === "string") {
                // Fetch retention period & rds number based on id string
                const rdsData = getRdsDetailsById(parseInt(value));
                if (rdsData) {
                    updatedDocuments[index] = {
                        ...updatedDocuments[index],
                        id: rdsData.id,
                        document_title: rdsData.document_title,
                        rds_number: rdsData.rds_number || "",
                        retention_period: String(rdsData.retention_period),
                        document_date: {
                            start: null,
                            end: null,
                            readable: null,
                        },
                        disposal_date: null,
                    };
                }
            } else if (field === "document_date" && typeof value !== "string") {
                // Ensure document date range is within the same year
                if (value?.start && value?.end) {
                    const startYear = value.start.toDate("UTC").getFullYear();
                    const endYear = value.end.toDate("UTC").getFullYear();
                    if (startYear !== endYear) {
                        console.error(
                            "Document date must be within the same year."
                        );
                        return prev; // Prevent state update
                    }
                }

                // Enforce all docs have the same year
                if (index > 0) {
                    const firstDocYear = prev.box_details[0]?.document_date
                        ?.start
                        ? dayjs(
                              prev.box_details[0].document_date.start.raw
                          ).year()
                        : null;
                    const selectedYear = value?.start
                        ? dayjs(value.start.toDate("UTC")).year()
                        : null;
                    if (
                        firstDocYear !== null &&
                        selectedYear !== firstDocYear
                    ) {
                        setErrors((prevErrors: any) => ({
                            ...prevErrors,
                            box_details: prevErrors.box_details.map(
                                (error: any, idx: number) =>
                                    idx === index
                                        ? {
                                              ...error,
                                              document_date: `All documents must have the same year: ${firstDocYear}`,
                                          }
                                        : error
                            ),
                        }));
                        return prev; // Keep state unchanged
                    }
                }

                updatedDocuments[index] = {
                    ...updatedDocuments[index],
                    document_date: formattedDate,
                    disposal_date: calculateDocumentDisposalDate(
                        formattedDate,
                        updatedDocuments[index].retention_period
                    ),
                };
            } else {
                updatedDocuments[index] = {
                    ...updatedDocuments[index],
                    [field]: value,
                };
            }

            // Prepare new box data with updated documents
            const newBoxData = {
                ...prev,
                box_details: updatedDocuments,
            };

            // Update disposal date and priority level based on new box details
            const { disposalDate, priorityLevel } =
                updateBoxDisposalDate(updatedDocuments);

            // disposalDate can be BoxDate | null | "Permanent"
            if (disposalDate !== null && disposalDate !== undefined) {
                newBoxData.disposal_date = disposalDate;
            }
            if (priorityLevel) {
                newBoxData.priority_level = priorityLevel;
            }

            return newBoxData;
        });
    };

    const onBoxCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoxData((prev) => ({ ...prev, box_code: e.target.value }));
    };

    const onOfficeChange = (office: { id: number; name: string }) => {
        setBoxData((prev) => ({ ...prev, office }));
    };

    const onRemarksChange = (remarks: string) => {
        setBoxData((prev) => ({ ...prev, remarks }));
    };

    /** ✅ Add a new document */
    const addDocument = () => {
        const newDocument: BoxDetails = {
            id: null,
            document_code: generateDocumentCode(),
            document_title: null,
            rds_number: "",
            retention_period: "",
            document_date: {
                start: null,
                end: null,
                readable: null,
            },
            disposal_date: {
                raw: null,
                formatted: null,
            },
        };

        setBoxData((prev) => {
            const updatedDocuments = [...prev.box_details, newDocument];
            return { ...prev, box_details: updatedDocuments };
        });

        setErrors((prev: any) => {
            const updatedErrors = [
                ...prev.box_details,
                {
                    ...newDocument,
                    // Optional: replace fields with empty strings or error-friendly formats
                    document_date: {
                        start: null,
                        end: null,
                    },
                    disposal_date: {
                        raw: null,
                        formatted: null,
                    },
                },
            ];
            return { ...prev, box_details: updatedErrors };
        });
    };

    /** ❌ Delete a document by index */
    const deleteDocument = (index: number) => {
        setBoxData((prev) => {
            const updatedDocuments = prev.box_details.filter(
                (_, i) => i !== index
            );

            const { disposalDate, priorityLevel } =
                updateBoxDisposalDate(updatedDocuments);

            return {
                ...prev,
                box_details: updatedDocuments,
                disposal_date: disposalDate ?? prev.disposal_date, // ✅ Ensure disposal date updates
                priority_level: priorityLevel ?? prev.priority_level, // ✅ Ensure priority level updates
            };
        });
    };

    const saveBoxDataToBoxes = () => {
        const { hasError, errors } = validateBoxData(boxData);

        if (hasError) {
            setErrors(errors);
            // console.error("Validation errors:", errors);
            return hasError;
        }

        const updatedBoxData = {
            ...boxData,
            id: boxes.length + 1,
        };

        const updatedBoxes = [...boxes, updatedBoxData];

        setBoxes(updatedBoxes);
        localStorage.setItem("boxes", JSON.stringify(updatedBoxes));

        resetBoxData();
    };

    const validateBoxData = (
        box: BoxFormState
    ): { hasError: boolean; errors: any } => {
        let hasError = false;

        const newErrors: any = {
            id: box.id ?? null,
            box_code: "",
            priority_level: "",
            office: null,
            box_details: [],
            remarks: "",
            disposal_date: "",
        };

        if (!box.box_code?.trim()) {
            newErrors.box_code = "Box code is required.";
            hasError = true;
        }

        if (!box.priority_level?.value?.trim()) {
            newErrors.priority_level = "Priority level is required.";
            hasError = true;
        }

        if (box.box_details.length === 0) {
            hasError = true;
        }

        newErrors.box_details = box.box_details.map((doc) => {
            const docErrors: any = {
                id: doc.id,
                document_title: "",
                rds_number: doc.rds_number,
                retention_period: doc.retention_period,
                document_date: {
                    start: null,
                    end: null,
                },
                disposal_date: {
                    raw: null,
                    formatted: null,
                },
            };

            if (!doc.document_title?.trim()) {
                docErrors.document_title = "Document title is required.";
                hasError = true;
            }

            // Check if document_date.start exists and has raw value
            if (!doc.document_date?.start?.raw?.trim()) {
                docErrors.document_date.start = "Start date is required.";
                hasError = true;
            }

            // Check disposal_date, skip if it's "Permanent"
            if (
                doc.disposal_date !== "Permanent" &&
                !doc.disposal_date?.raw?.trim()
            ) {
                docErrors.disposal_date.raw = "Disposal date is required.";
                hasError = true;
            }

            return docErrors;
        });

        return { hasError, errors: newErrors };
    };

    const formatDocumentDate = (dateRange: BoxDateRange | null): string =>
        !dateRange?.start?.formatted
            ? "N/A"
            : dateRange.end?.formatted &&
              dateRange.end.formatted !== dateRange.start.formatted
            ? `${dateRange.start.formatted} - ${dateRange.end.formatted}`
            : dateRange.start.formatted;

    const formatDisposalDate = (
        disposalDate: BoxDate | "Permanent" | null
    ): string =>
        disposalDate === "Permanent"
            ? "Permanent"
            : disposalDate?.formatted ?? "N/A";

    /** ✅ Generate a unique document code */

    return (
        <BoxFormContext.Provider
            value={{
                boxes,
                boxData,
                errors,
                rdsData,
                rdsLoading,
                rdsError,
                getBoxById,
                deleteBox,
                saveBoxDataToBoxes,
                setBoxData,
                onBoxCodeChange,
                onOfficeChange,
                onDocumentChange,
                onRemarksChange,
                addDocument,
                deleteDocument,
                parseDateRange,
                resetBoxes,
                setBoxes,
                editBox,
                resetBoxData,
                formatDocumentDate,
                formatDisposalDate,
            }}
        >
            {children}
        </BoxFormContext.Provider>
    );
};
