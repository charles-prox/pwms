import { PDFLayout } from "@/RequestForms/PDFLayout";
import RequestForDisposal from "@/RequestForms/RequestForDisposal";
import RequestForReturn from "@/RequestForms/RequestForReturn";
import RequestForStorage from "@/RequestForms/RequestForStorage";
import RequestForWithdrawal from "@/RequestForms/RequestForWithdrawal";
import { usePage } from "@inertiajs/react";

function FormPreview() {
    const requestType: any = "storage";
    const { form_data = [] } = usePage().props;

    const renderContent = () => {
        switch (requestType) {
            case "withdrawal":
                return <RequestForWithdrawal data={form_data} />;
            case "return":
                return <RequestForReturn data={form_data} />;
            case "disposal":
                return <RequestForDisposal data={form_data} />;
            default:
                return (
                    <RequestForStorage
                        data={form_data}
                        gsuHead={"GLADYS A. ELTANAL"}
                    />
                );
        }
    };

    return (
        <PDFLayout
            preparedBy={{ name: "John Doe", position: "Document Custodian" }}
            office="PhilHealth Main Office"
            officeHead="GLADYS A. ELTANAL"
            regionDC="CHERRY MAE G. SERIÑA"
            msdHead="MAE R. DIZON"
            gsuHHead="GLADYS A. ELTANAL"
        >
            {renderContent()}
        </PDFLayout>
    );
}

export default FormPreview;
