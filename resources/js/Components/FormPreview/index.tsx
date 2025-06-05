import { PDFLayout } from "@/RequestForms/PDFLayout";
import RequestForDisposal from "@/RequestForms/RequestForDisposal";
import RequestForReturn from "@/RequestForms/RequestForReturn";
import RequestForStorage from "@/RequestForms/RequestForStorage";
import RequestForWithdrawal from "@/RequestForms/RequestForWithdrawal";
import { usePage } from "@inertiajs/react";

function FormPreview() {
    const { form = {} } = usePage<any>().props;

    const renderContent = () => {
        switch (form.request?.type) {
            case "withdrawal":
                return <RequestForWithdrawal data={form} />;
            case "return":
                return <RequestForReturn data={form} />;
            case "disposal":
                return <RequestForDisposal data={form} />;
            default:
                return (
                    <RequestForStorage
                        data={form.request}
                        gsuHead={form.gsu_head}
                    />
                );
        }
    };

    return (
        <PDFLayout
            requestType={form.request?.type || "storage"}
            preparedBy={{
                name:
                    form.request.creator.first_name +
                    (form.request.creator.middle_name
                        ? " " +
                          form.request.creator.middle_name.charAt(0) +
                          ". "
                        : " ") +
                    form.request.creator.last_name,
                position: form.request.creator.position,
            }}
            office={form.request.creator.office}
            officeHead={form.creator_office_head}
            regionDC={form.rdc_officer}
            msdHead={form.msd_head}
            gsuHead={form.gsu_head}
        >
            {renderContent()}
        </PDFLayout>
    );
}

export default FormPreview;
