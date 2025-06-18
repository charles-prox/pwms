import React from "react";
import {
    Select as NextuiSelect,
    SelectItem,
    Autocomplete,
    AutocompleteItem,
    AutocompleteSection,
} from "@heroui/react";
import { getTailwindWidthClass } from "@/Utils/helpers";

const Select = <T extends object>({
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
    items = [],
    keyField,
    labelField,
    valueField,
    selectedKeys,
    menuTrigger,
    onSelectionChange,
    onInputChange,
    allowsCustomValue = false,
    variant = undefined,
    section = null,
}: SelectProps<T>) => {
    const groupedItems = section
        ? Array.from(items).reduce((acc, item) => {
              const key = (item as any)[section] ?? "Unknown"; // Default to "Unknown" if null
              if (!acc[key]) {
                  acc[key] = [];
              }
              acc[key].push(item);
              return acc;
          }, {} as Record<string, T[]>)
        : {};

    return (
        <>
            {autocomplete ? (
                <Autocomplete
                    allowsCustomValue={allowsCustomValue}
                    name={name}
                    id={name}
                    defaultItems={items}
                    label={label}
                    labelPlacement={labelPlacement}
                    placeholder={placeholder}
                    variant={variant}
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
                    onInputChange={onInputChange}
                    isRequired={isRequired}
                    isInvalid={!!errorMessage} // Pass the error state
                    color={!!errorMessage ? "danger" : color}
                    errorMessage={errorMessage}
                    startContent={startContent}
                    endContent={endContent}
                    isDisabled={isDisabled}
                    allowsEmptyCollection
                >
                    {!!section && Object.keys(groupedItems).length > 0
                        ? Object.entries(groupedItems).map(
                              ([section, items]) => (
                                  <AutocompleteSection
                                      key={section}
                                      title={section}
                                      showDivider
                                      classNames={{
                                          heading: "text-sm font-bold",
                                      }}
                                  >
                                      {items.map((item: any) => (
                                          <AutocompleteItem
                                              key={item[keyField]}
                                          >
                                              {item[labelField]}
                                          </AutocompleteItem>
                                      ))}
                                  </AutocompleteSection>
                              )
                          )
                        : items &&
                          Array.from(items).map((item: any) => (
                              <AutocompleteItem key={item[keyField]}>
                                  {item[labelField]}
                              </AutocompleteItem>
                          ))}
                </Autocomplete>
            ) : (
                <NextuiSelect
                    label={label}
                    labelPlacement={labelPlacement}
                    variant={variant}
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
                        innerWrapper: "text-foreground/60",
                        selectorIcon: "text-foreground",
                    }}
                >
                    {Array.from(items ?? []).map((item: any) => (
                        <SelectItem key={item[valueField || keyField]}>
                            {item[labelField]}
                        </SelectItem>
                    ))}
                </NextuiSelect>
            )}
        </>
    );
};

export default Select;
