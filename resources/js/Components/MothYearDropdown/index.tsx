import React, { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectItem,
    Button,
    type Selection,
} from "@heroui/react";
import { Calendar } from "lucide-react";
import clsx from "clsx";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const years = Array.from({ length: 20 }, (_, i) => {
    const y = currentYear - 10 + i;
    return { key: y.toString(), label: y.toString() };
});

export function MonthYearDropdown() {
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<Selection>(
        new Set([currentYear.toString()])
    );

    const handleMonthSelect = (monthIndex: number) => {
        setSelectedMonth(monthIndex);
    };

    const handleYearChange = (key: Selection) => {
        setSelectedYear(key);
    };

    const selectedYearValue = Array.from(selectedYear)[0];
    const triggerLabel =
        selectedMonth !== null && selectedYearValue
            ? `${months[selectedMonth]} ${selectedYearValue}`
            : "Select Month & Year";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="flat"
                    className="w-[200px] justify-between text-foreground"
                >
                    {triggerLabel}
                    <Calendar className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[280px] p-4 space-y-4">
                <Select
                    selectedKeys={selectedYear}
                    onSelectionChange={handleYearChange}
                >
                    {years.map((year) => (
                        <SelectItem key={year.key}>{year.label}</SelectItem>
                    ))}
                </Select>

                <div className="grid grid-cols-3 gap-2">
                    {months.map((month, index) => (
                        <button
                            key={index}
                            onClick={() => handleMonthSelect(index)}
                            className={clsx(
                                "text-sm rounded px-2 py-1 transition-colors",
                                "hover:bg-muted hover:text-foreground",
                                selectedMonth === index &&
                                    "bg-primary text-white"
                            )}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
