import React from "react";
import {
    Select as NextuiSelect,
    SelectItem,
    Autocomplete,
    AutocompleteItem,
} from "@nextui-org/react";
import { getTailwindWidthClass } from "@/Utils/helpers";

const Select = <T,>({
    label, //label: string;
    labelPlacement = "inside", //labelPlacement
    placeholder, //placeholder?: string;
    maxWidthClass = "min-w-64",
    autocomplete = false,
    isClearable,
    startContent,
    endContent,
    isRequired,
    name,
    color = "default",
    errorMessage,
    isDisabled,
    items,
    keyField,
    labelField,
    valueField,
    selectedKeys,
    menuTrigger,
    onSelectionChange,
}: SelectProps<T>) => {
    return (
        <>
            {autocomplete ? (
                <Autocomplete
                    name={name}
                    id={name}
                    defaultItems={items}
                    label={label}
                    labelPlacement={labelPlacement}
                    placeholder={placeholder}
                    variant="bordered"
                    inputProps={{
                        classNames: {
                            label: "text-black dark:text-white/90 font-bold",
                            inputWrapper: "border-slate-400",
                            base: maxWidthClass
                                ? getTailwindWidthClass(maxWidthClass)
                                : "", // pass maxWidth if provided
                        },
                    }}
                    defaultSelectedKey={selectedKeys}
                    isClearable={isClearable}
                    menuTrigger={menuTrigger}
                    onSelectionChange={onSelectionChange}
                    isRequired={isRequired}
                    isInvalid={!!errorMessage} // Pass the error state
                    color={!!errorMessage ? "danger" : color}
                    errorMessage={errorMessage}
                    startContent={startContent}
                    endContent={endContent}
                    isDisabled={isDisabled}
                    allowsEmptyCollection
                >
                    {(item: any) => (
                        <AutocompleteItem key={item[keyField]}>
                            {item[labelField]}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            ) : (
                <NextuiSelect
                    label={label}
                    variant="bordered"
                    placeholder={placeholder}
                    selectedKeys={selectedKeys}
                    onSelectionChange={onSelectionChange} // Use onChange here
                    isRequired={isRequired} // Add required prop if needed
                    isInvalid={!!errorMessage} // Pass the error state
                    errorMessage={errorMessage}
                    startContent={startContent}
                    endContent={endContent}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                        trigger: "border-slate-400",
                        base: maxWidthClass
                            ? getTailwindWidthClass(maxWidthClass)
                            : "", // pass maxWidth if provided
                    }}
                >
                    {Array.from(items ?? []).map((item: any) => (
                        <SelectItem
                            key={item[keyField]}
                            value={item[valueField || keyField]}
                        >
                            {item[labelField]}
                        </SelectItem>
                    ))}
                </NextuiSelect>
            )}
        </>
    );
};

export default Select;
