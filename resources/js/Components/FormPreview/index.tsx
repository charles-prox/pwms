import { PDFLayout } from "@/RequestForms/PDFLayout";
import { View, Text } from "@react-pdf/renderer";

export default function FormPreview() {
    return (
        <PDFLayout
            formNo="PHILHEALTH-QP-02-F04"
            title="Request for Records Disposal Form"
            preparedBy={{ name: "John Doe", position: "Document Custodian" }}
            office="PhilHealth Main Office"
            officeHead="GLADYS A. ELTANAL"
            regionDC="CHERRY MAE G. SERIÑA"
            msdHead="MAE R. DIZON"
            gsuHHead="GLADYS A. ELTANAL"
        >
            <View>
                <Text>This is your form content.</Text>
            </View>
        </PDFLayout>
    );
}
