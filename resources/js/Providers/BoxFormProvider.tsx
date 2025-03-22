import { BoxFormContext } from "@/Contexts/BoxFormContext";
import React from "react";
import dayjs from "dayjs";
import { BoxDetails, BoxFormState } from "@/Utils/types";
import { useState } from "react";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import useRdsData from "@/Hooks/useRdsData";

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
        const storedBoxes = sessionStorage.getItem("boxes");
        return storedBoxes ? JSON.parse(storedBoxes) : [];
    });

    const [boxData, setBoxData] = useState<BoxFormState>({
        id: 1,
        box_code: "",
        priority_level: null,
        remarks: "",
        disposal_date: "",
        office: null,
        box_details: [
            {
                id: null,
                document_title: null,
                rds_number: "",
                retention_period: "",
                document_date: {
                    raw: null,
                    formatted: null,
                },
                disposal_date: {
                    raw: null,
                    formatted: null,
                },
            },
        ] as BoxDetails[],
    });

    const [errors, setErrors] = useState<any>({
        id: 1,
        box_code: "",
        priority_level: "",
        office: null,
        box_details: [
            {
                id: null,
                document_title: null,
                rds_number: "",
                retention_period: "",
                document_date: {
                    raw: null,
                    formatted: null,
                },
                disposal_date: {
                    raw: null,
                    formatted: null,
                },
            },
        ] as BoxDetails[],
        remarks: "",
        disposal_date: "",
    });

    const resetBoxData = () => {
        const initialData = {
            id: 1,
            box_code: "",
            priority_level: null,
            remarks: "",
            disposal_date: "",
            office: null,
            box_details: [
                {
                    id: null,
                    document_title: null,
                    rds_number: "",
                    retention_period: "",
                    document_date: {
                        raw: null,
                        formatted: null,
                    },
                    disposal_date: {
                        raw: null,
                        formatted: null,
                    },
                },
            ],
        };
        setBoxData(initialData);
        setErrors(initialData);
    };

    const formatDateRange = (dateRange: RangeValue<DateValue> | null) => {
        if (!dateRange || !dateRange.start)
            return { raw: null, formatted: null };
        const start = dayjs(dateRange.start.toDate("UTC")).format("YYYY-MM-DD");
        const end = dateRange.end
            ? dayjs(dateRange.end.toDate("UTC")).format("YYYY-MM-DD")
            : start;
        const raw = start === end ? start : `${start} to ${end}`;

        const startDate = dayjs(start);
        const endDate = dayjs(end);

        let formatted;
        if (startDate.isSame(endDate, "year")) {
            if (startDate.isSame(endDate, "month")) {
                if (startDate.isSame(endDate, "day")) {
                    formatted = `${startDate.format("MMMM D, YYYY")}`;
                } else {
                    formatted = `${startDate.format("MMMM D")}-${endDate.format(
                        "D, YYYY"
                    )}`;
                }
            } else {
                formatted = `${startDate.format("MMMM D")} - ${endDate.format(
                    "MMMM D, YYYY"
                )}`;
            }
        } else {
            formatted = `${startDate.format("MMMM D, YYYY")} - ${endDate.format(
                "MMMM D, YYYY"
            )}`;
        }

        return { raw, formatted };
    };

    const parseDateRange = (
        dateStr: string | null
    ): RangeValue<DateValue> | null => {
        if (!dateStr) return null;
        const dates = dateStr.split(" to ").map((d) => {
            const [year, month, day] = d.trim().split("-").map(Number);
            return new CalendarDate(year, month, day);
        });

        return dates.length > 1
            ? { start: dates[0], end: dates[1] }
            : { start: dates[0], end: dates[0] };
    };

    const extractLatestDate = (dateStr: string) => {
        if (!dateStr) return null;
        const dates = dateStr
            .split(" to ")
            .map((d) => dayjs(d.trim(), "YYYY-MM-DD", true));
        return dates.length > 1 ? dates[1] : dates[0];
    };

    const calculateDocumentDisposalDate = (
        documentDate: string | null,
        retentionPeriod: string
    ) => {
        if (retentionPeriod.toLowerCase() === "permanent")
            return { raw: "Permanent", formatted: "Permanent" };

        if (!documentDate) return { raw: null, formatted: null };

        const endDate = extractLatestDate(documentDate);
        const retentionYears = parseInt(retentionPeriod, 10);

        if (!endDate?.isValid() || isNaN(retentionYears))
            return { raw: null, formatted: null };
        const raw = endDate.add(retentionYears, "year").format("YYYY-MM-DD");
        const formatted = endDate
            .add(retentionYears, "year")
            .format("MMMM D, YYYY");
        return { raw, formatted };
    };

    const updateBoxDisposalDate = (updatedBoxDetails: BoxDetails[]) => {
        // Check if any document has a disposal date of "Permanent"
        const hasPermanentDisposal = updatedBoxDetails.some(
            (doc) => doc.disposal_date?.raw?.toLowerCase() === "permanent"
        );

        if (hasPermanentDisposal) {
            return {
                disposalDate: "Permanent",
                priorityLevel: { value: "red", label: "RED (Permanent Files)" },
            };
        }

        const validDisposalDates = updatedBoxDetails
            .map((doc) => dayjs(doc.disposal_date.raw, "YYYY-MM-DD", true))
            .filter((date) => date.isValid());

        if (validDisposalDates.length === 0) {
            return { disposalDate: null, priorityLevel: null };
        }

        const maxDisposalDate = validDisposalDates.reduce(
            (latest, current) => (current.isAfter(latest) ? current : latest),
            dayjs(0)
        );

        const disposalDate = maxDisposalDate.isValid()
            ? maxDisposalDate.add(1, "year").format("MMMM YYYY")
            : null;

        // Calculate the maximum retention period
        const maxRetentionPeriod = updatedBoxDetails.reduce((max, doc) => {
            const retentionYears = parseInt(doc.retention_period, 10);
            return !isNaN(retentionYears) && retentionYears > max
                ? retentionYears
                : max;
        }, 0);

        let priorityLevel = null;
        if (maxRetentionPeriod >= 3) {
            priorityLevel = {
                value: "green",
                label: "GREEN (3 years above retention period)",
            };
        } else if (maxRetentionPeriod >= 1) {
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
            console.log("field:", field);
            const formattedDate = formatDateRange(
                value as RangeValue<DateValue>
            );

            if (field === "id" && typeof value === "string") {
                // ✅ Fetch retention period & rds number
                console.log("value: " + value);

                const rdsData = getRdsDetailsById(parseInt(value));
                console.log("rdsData", rdsData);

                if (rdsData) {
                    updatedDocuments[index] = {
                        ...updatedDocuments[index],
                        id: rdsData.id,
                        document_title: rdsData.document_title,
                        rds_number: rdsData.rds_number || "",
                        retention_period: String(rdsData.retention_period),
                        document_date: {
                            raw: null,
                            formatted: null,
                        },
                    };
                }
            } else if (field === "document_date" && typeof value !== "string") {
                const selectedYear = dayjs(value?.start.toDate("UTC")).year();

                if (value?.start && value?.end) {
                    const startYear = value.start.toDate("UTC").getFullYear();
                    const endYear = value.end.toDate("UTC").getFullYear();

                    if (startYear !== endYear) {
                        console.error(
                            "Document date must be within the same year."
                        );
                        return prev; // Prevents state update
                    }
                }

                if (index > 0) {
                    // If it's the first document, store its year
                    const firstDocYear = prev.box_details[0]?.document_date.raw
                        ? dayjs(
                              prev.box_details[0].document_date.raw.split(
                                  " to "
                              )[0]
                          ).year()
                        : null;

                    // Prevent adding a different year
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
                        return prev; // Keep the state unchanged
                    }
                }

                updatedDocuments[index] = {
                    ...updatedDocuments[index],
                    document_date: formattedDate,
                    disposal_date: calculateDocumentDisposalDate(
                        formattedDate.raw,
                        updatedDocuments[index].retention_period
                    ),
                };
            } else {
                updatedDocuments[index] = {
                    ...updatedDocuments[index],
                    [field]: value,
                };
            }

            const newBoxData = {
                ...prev,
                box_details: updatedDocuments,
            };

            // Update disposal date and priority level based on new box details
            const { disposalDate, priorityLevel } =
                updateBoxDisposalDate(updatedDocuments);

            console.log("Disposal date:", disposalDate);
            console.log("Priority level:", priorityLevel);

            if (disposalDate) {
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

    /** ✅ Add a new document */
    const addDocument = () => {
        const newDocument: BoxDetails = {
            id: null, // Generate unique ID
            document_title: null,
            rds_number: "",
            retention_period: "",
            document_date: {
                raw: null,
                formatted: null,
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
            const updatedDocuments = [...prev.box_details, newDocument];
            return { ...prev, box_details: updatedDocuments };
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
        let hasError = false;

        const newErrors: any = {
            id: 1,
            box_code: "",
            priority_level: "",
            office: null,
            box_details: [],
            remarks: "",
            disposal_date: "",
        };

        if (!boxData.box_code?.trim()) {
            newErrors.box_code = "Box code is required.";
            hasError = true;
        }
        if (!boxData.priority_level?.value?.trim()) {
            newErrors.priority_level = "Priority level is required.";
            hasError = true;
        }
        if (!boxData.office) {
            newErrors.office = "Office is required.";
            hasError = true;
        }

        if (boxData.box_details.length === 0) {
            hasError = true;
        }

        newErrors.box_details = boxData.box_details.map((doc) => {
            const docErrors: BoxDetails = {
                id: doc.id,
                document_title: "",
                rds_number: doc.rds_number, // Not required
                retention_period: doc.retention_period, // Not required
                document_date: {
                    raw: null,
                    formatted: null,
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
            if (!doc.document_date.raw?.trim()) {
                docErrors.document_date.raw = "Document date is required.";
                hasError = true;
            }
            if (!doc.disposal_date.raw?.trim()) {
                docErrors.disposal_date.raw = "Disposal date is required.";
                hasError = true;
            }

            return docErrors;
        });

        if (hasError) {
            setErrors(newErrors);
            console.error("Validation errors:", newErrors);
            return hasError;
        }

        const updatedBoxData = {
            ...boxData,
            id: boxes.length + 1,
        };

        const updatedBoxes = [...boxes, updatedBoxData];

        // Save to state
        setBoxes(updatedBoxes);

        // Save to session storage
        sessionStorage.setItem("boxes", JSON.stringify(updatedBoxes));

        resetBoxData();
    };

    return (
        <BoxFormContext.Provider
            value={{
                boxes,
                boxData,
                errors,
                rdsData,
                rdsLoading,
                rdsError,
                saveBoxDataToBoxes,
                setBoxData,
                onBoxCodeChange,
                onOfficeChange,
                onDocumentChange,
                addDocument,
                deleteDocument,
                parseDateRange,
            }}
        >
            {children}
        </BoxFormContext.Provider>
    );
};
