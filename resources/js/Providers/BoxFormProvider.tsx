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
        priority_level: "",
        remarks: "",
        disposal_date: "",
        office: null,
        box_details: [
            {
                id: null,
                document_title: null,
                rds_number: "",
                retention_period: "",
                document_date: "", // Store as a string: "YYYY-MM-DD to YYYY-MM-DD"
                disposal_date: "",
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
                document_date: "",
                disposal_date: "",
            },
        ] as BoxDetails[],
        remarks: "",
        disposal_date: "",
    });

    const resetBoxData = () => {
        const initialData = {
            id: 1,
            box_code: "",
            priority_level: "",
            remarks: "",
            disposal_date: "",
            office: null,
            box_details: [
                {
                    id: null,
                    document_title: null,
                    rds_number: "",
                    retention_period: "",
                    document_date: "",
                    disposal_date: "",
                },
            ],
        };
        setBoxData(initialData);
        setErrors(initialData);
    };

    const formatDateRange = (dateRange: RangeValue<DateValue> | null) => {
        if (!dateRange || !dateRange.start) return "";
        const start = dayjs(dateRange.start.toDate("UTC")).format("YYYY-MM-DD");
        const end = dateRange.end
            ? dayjs(dateRange.end.toDate("UTC")).format("YYYY-MM-DD")
            : start;
        return start === end ? start : `${start} to ${end}`;
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
        documentDate: string,
        retentionPeriod: string
    ) => {
        if (retentionPeriod.toLowerCase() === "permanent") return "Permanent";

        const endDate = extractLatestDate(documentDate);
        const retentionYears = parseInt(retentionPeriod, 10);

        if (!endDate?.isValid() || isNaN(retentionYears)) return "";
        return endDate.add(retentionYears, "year").format("YYYY-MM-DD");
    };

    const updateBoxDisposalDate = (updatedBoxDetails: BoxDetails[]) => {
        // Check if any document has a disposal date of "Permanent"
        const hasPermanentDisposal = updatedBoxDetails.some(
            (doc) => doc.disposal_date?.toLowerCase() === "permanent"
        );

        if (hasPermanentDisposal) {
            return "Permanent";
        }

        const validDisposalDates = updatedBoxDetails
            .map((doc) => dayjs(doc.disposal_date, "YYYY-MM-DD", true))
            .filter((date) => date.isValid());

        if (validDisposalDates.length === 0) {
            return null;
        }

        const maxDisposalDate = validDisposalDates.reduce(
            (latest, current) => (current.isAfter(latest) ? current : latest),
            dayjs(0)
        );

        return maxDisposalDate.isValid()
            ? maxDisposalDate.add(1, "year").format("MMMM YYYY")
            : null;
    };

    const onDocumentChange = (
        index: number,
        field: keyof BoxDetails,
        value: RangeValue<DateValue> | string | null
    ) => {
        setBoxData((prev) => {
            const updatedDocuments = [...prev.box_details];

            if (field === "id" && typeof value === "string") {
                // ✅ Fetch retention period & rds number
                const rdsData = getRdsDetailsById(parseInt(value));

                if (rdsData) {
                    updatedDocuments[index] = {
                        ...updatedDocuments[index],
                        document_title: rdsData.document_title,
                        rds_number: rdsData.rds_number || "",
                        retention_period: String(rdsData.retention_period),
                    };
                }
            } else if (field === "document_date" && typeof value !== "string") {
                const formattedDate = formatDateRange(
                    value as RangeValue<DateValue>
                );
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
                    const firstDocYear = prev.box_details[0]?.document_date
                        ? dayjs(
                              prev.box_details[0].document_date.split(" to ")[0]
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

            const newBoxData = {
                ...prev,
                box_details: updatedDocuments,
            };

            // Update disposal date based on new box details
            const updatedDisposalDate = updateBoxDisposalDate(updatedDocuments);
            if (updatedDisposalDate) {
                newBoxData.disposal_date = updatedDisposalDate;
            }

            return newBoxData;
        });
    };

    const onBoxCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoxData((prev) => ({ ...prev, box_code: e.target.value }));
    };

    const onPriorityLevelChange = (level: string) => {
        setBoxData((prev) => ({ ...prev, priority_level: level }));
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
            document_date: "",
            disposal_date: "",
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

            const updatedDisposalDate = updateBoxDisposalDate(updatedDocuments);

            return {
                ...prev,
                box_details: updatedDocuments,
                disposal_date: updatedDisposalDate ?? prev.disposal_date, // ✅ Ensure disposal date updates
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
        if (!boxData.priority_level?.trim()) {
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
                document_date: "",
                disposal_date: "",
            };

            if (!doc.document_title?.trim()) {
                docErrors.document_title = "Document title is required.";
                hasError = true;
            }
            if (!doc.document_date?.trim()) {
                docErrors.document_date = "Document date is required.";
                hasError = true;
            }
            if (!doc.disposal_date?.trim()) {
                docErrors.disposal_date = "Disposal date is required.";
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
                onPriorityLevelChange,
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
