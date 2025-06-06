import { PDFLayout } from "@/RequestForms/PDFLayout";
import RequestForDisposal from "@/RequestForms/RequestForDisposal";
import RequestForReturn from "@/RequestForms/RequestForReturn";
import RequestForStorage from "@/RequestForms/RequestForStorage";
import RequestForWithdrawal from "@/RequestForms/RequestForWithdrawal";
import { usePage } from "@inertiajs/react";

function FormPreview() {
    const { form_details = {} } = usePage<any>().props;

    const renderContent = () => {
        switch (form_details.request?.type) {
            case "withdrawal":
                return <RequestForWithdrawal data={form_details} />;
            case "return":
                return <RequestForReturn data={form_details} />;
            case "disposal":
                return <RequestForDisposal data={form_details} />;
            default:
                return (
                    <RequestForStorage
                        data={form_details.request}
                        gsuHead={form_details.gsu_head}
                    />
                );
        }
    };

    return (
        <PDFLayout
            requestType={form_details.request?.type || "storage"}
            preparedBy={{
                name:
                    form_details.request.creator.first_name +
                    (form_details.request.creator.middle_name
                        ? " " +
                          form_details.request.creator.middle_name.charAt(0) +
                          ". "
                        : " ") +
                    form_details.request.creator.last_name,
                position: form_details.request.creator.position,
            }}
            office={form_details.request.creator.office}
            officeHead={form_details.creator_office_head}
            regionDC={form_details.rdc_officer}
            msdHead={form_details.msd_head}
            gsuHead={form_details.gsu_head}
            formNumber={form_details.request.form_number}
        >
            {renderContent()}
        </PDFLayout>
    );
}

export default FormPreview;
