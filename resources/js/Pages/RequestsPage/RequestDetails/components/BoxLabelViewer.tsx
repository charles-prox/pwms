// components/BoxLabelViewer.tsx
import React from "react";
import { Page, Text, Document, PDFViewer, View } from "@react-pdf/renderer";
import { BoxFormState, BoxDetails, FormProp } from "@/Utils/types";
import { styles } from "../config/styles";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Link,
    Button,
    Tooltip,
} from "@heroui/react";
import { toTitleCase } from "@/Utils/helpers";
import Icon from "@/Components/Icon";
import { usePage } from "@inertiajs/react";
import useFetch from "@/Hooks/useFetch";

interface LabelProps {
    data: BoxFormState;
    userName?: string;
    office: string;
}

const Row: React.FC<{ items: BoxDetails[] }> = ({ items }) => (
    <>
        {items.map((item, index) => (
            <View
                wrap={true}
                style={styles.perRecordRow}
                key={item.id ?? index}
            >
                <Text style={styles.title}>
                    ({index + 1}){" "}
                    {toTitleCase(item.document_title || "Untitled Document")}
                </Text>
            </View>
        ))}
    </>
);

const BoxLabelPdf: React.FC<LabelProps> = ({
    data,
    userName = "N/A",
    office,
}) => (
    <PDFViewer
        width={window.innerWidth}
        height={window.innerHeight - 60}
        showToolbar
    >
        <Document title={data.box_code + " Box Label"}>
            <Page style={styles.body} orientation="landscape" size="A4">
                <View wrap={false}>
                    {/* Priority Level */}
                    <Text>ANNEX B</Text>

                    <View style={styles.priorityRow}>
                        <Text>Priority Level: </Text>
                        <View style={styles.priorityCode}>
                            <Text>{data.priority_level?.value || "None"}</Text>
                        </View>
                    </View>

                    <View style={{ border: "1px solid black" }}>
                        {/* Classification */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>
                                Records Classification:{" "}
                            </Text>
                            <Text style={styles.rowValue}>Storage</Text>
                        </View>

                        {/* Department */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Department: </Text>
                            <Text style={styles.rowValue}>{office}</Text>
                        </View>

                        {/* Box Code */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>
                                Box Code/Control No.:{" "}
                            </Text>
                            <Text style={styles.rowValue}>{data.box_code}</Text>
                        </View>

                        {/* Records */}
                        <View
                            style={{
                                borderBottom: "1px solid black",
                                padding: 5,
                                minHeight: 208,
                            }}
                        >
                            <Text style={styles.rowLabel}>
                                Title of Records per RDS:
                            </Text>
                            <Row items={data.box_details} />
                            {data.remarks?.trim() && (
                                <View>
                                    <Text
                                        style={{
                                            padding: "8 8 0 8",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Remarks:
                                    </Text>
                                    <Text style={{ padding: "5 20 0 20" }}>
                                        {data.remarks}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Officer */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>
                                Records Officer Designate:{" "}
                            </Text>
                            <Text style={styles.rowValue}>{userName}</Text>
                        </View>

                        {/* Record Dates */}
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Record Date: </Text>
                            <Text style={styles.rowValue}>
                                {data.box_details.length > 0
                                    ? data.box_details
                                          .map(
                                              (d, i) =>
                                                  `(${i + 1}) ${
                                                      d.document_date
                                                          ?.readable || "N/A"
                                                  }`
                                          )
                                          .join(", ")
                                    : "N/A"}
                            </Text>
                        </View>

                        {/* Disposal Date */}
                        <View style={styles.rowNoBorder}>
                            <Text style={styles.rowLabel}>Disposal Date: </Text>
                            <Text style={styles.rowValue}>
                                {data.disposal_date === "Permanent"
                                    ? "Permanent"
                                    : data.disposal_date?.formatted || "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    </PDFViewer>
);

// === Wrapper Component with Modal ===
interface ViewerProps {
    box: BoxFormState;
    trigger?: "link" | "button";
}

const BoxLabelViewer: React.FC<ViewerProps> = ({ box, trigger = "link" }) => {
    const { form } = usePage<FormProp>().props;
    const {
        data: office,
        loading: loadingOffice,
        error: officeError,
    } = useFetch<any>(route("offices.show", { id: form.office_id }));
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            {trigger === "button" ? (
                <Tooltip content="Print Box Label">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={onOpen}
                        color={"warning"}
                    >
                        <Icon name="print" size={20} />
                    </Button>
                </Tooltip>
            ) : (
                <Link
                    size="sm"
                    onPress={onOpen}
                    href="#"
                    className="text-blue-600 hover:underline"
                >
                    [ Print Label ]
                </Link>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Box Label Preview</ModalHeader>
                            <ModalBody className="p-0">
                                <BoxLabelPdf
                                    data={box}
                                    userName={form.creator}
                                    office={office.name}
                                />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default BoxLabelViewer;
