import dayjs from "dayjs";
import { BoxDetails, BoxFormState } from "@/Utils/types";
import { useEffect, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import useRdsData from "./useRdsData";

const useBoxForm = () => {
    const {
        rdsData,
        loading: rdsLoading,
        error: rdsError,
        getRdsDetailsById,
    } = useRdsData({ fetchAll: true });
    const [boxData, setBoxData] = useState<BoxFormState>({
        box_code: "",
        priority_level: "",
        remarks: "",
        disposal_date: "",
        office: "",
        box_details: [
            {
                id: 1,
                document_title: null,
                rds_number: "",
                retention_period: "",
                document_date: "", // Store as a string: "YYYY-MM-DD to YYYY-MM-DD"
                disposal_date: "",
            },
        ] as BoxDetails[],
    });

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
                        rds_number: rdsData.rds_number || "",
                        retention_period: String(rdsData.retention_period),
                    };
                }
            } else if (field === "document_date" && typeof value !== "string") {
                const formattedDate = formatDateRange(
                    value as RangeValue<DateValue>
                );
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

    const onOfficeChange = (office: string) => {
        setBoxData((prev) => ({ ...prev, office }));
    };

    /** ✅ Add a new document */
    const addDocument = () => {
        setBoxData((prev) => {
            const newDocument: BoxDetails = {
                id: prev.box_details.length + 1, // Generate unique ID
                document_title: null,
                rds_number: "",
                retention_period: "",
                document_date: "",
                disposal_date: "",
            };
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

    return {
        boxData,
        setBoxData,
        onBoxCodeChange,
        onPriorityLevelChange,
        onOfficeChange,
        onDocumentChange,
        addDocument,
        deleteDocument,
        parseDateRange,
        rdsData,
        rdsLoading,
        rdsError,
    };
};

export default useBoxForm;
