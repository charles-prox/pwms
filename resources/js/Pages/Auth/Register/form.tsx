import React from "react";
import { employmentStatus } from "@/Utils/constants";
import PasswordInput from "@/Components/Shared/PasswordInput";
import Select from "@/Components/Select";
import { useForm } from "@inertiajs/react";
import { Button } from "@heroui/react";
import useFetch from "@/Hooks/useFetch";
import Input from "@/Components/Input";

const RegisterForm = () => {
    const {
        data: offices,
        loading: loadingOffices,
        error: officesError,
    } = useFetch<any[]>(route("offices"));
    const {
        data: positions,
        loading: loadingPositions,
        error: positionError,
    } = useFetch<any[]>(route("positions"));
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            hris_id: "",
            user_id: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            position_id: "",
            contact_no: "",
            employment_status: "",
            office_id: "",
            email: "",
            password: "",
            password_confirmation: "",
        });

    React.useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <form onSubmit={submit}>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <Input
                            name="hris_id"
                            label="HRIS ID"
                            placeholder="Enter your HRIS ID"
                            value={data.hris_id}
                            onChange={(e) => {
                                clearErrors("hris_id");
                                setData("hris_id", e.target.value);
                            }}
                            variant="flat"
                            errorMessage={errors.hris_id}
                            isRequired
                        />
                        <Input
                            name="user_id"
                            label="User ID"
                            placeholder="Enter your desired User ID"
                            value={data.user_id}
                            onChange={(e) => {
                                clearErrors("user_id");
                                setData("user_id", e.target.value);
                            }}
                            errorMessage={errors.user_id}
                            variant="flat"
                            isRequired
                        />
                        <Select
                            autocomplete={true}
                            variant="flat"
                            name="employment_status"
                            label="Employment Status"
                            placeholder="Current employment status"
                            selectedKeys={data.employment_status}
                            items={employmentStatus}
                            keyField={"value"}
                            labelField={"label"}
                            menuTrigger="input"
                            onSelectionChange={(key: string) => {
                                clearErrors("employment_status");
                                setData("employment_status", key);
                            }}
                            isClearable={false}
                            errorMessage={errors.employment_status}
                            isRequired
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select
                            autocomplete={true}
                            variant="flat"
                            name="position_id"
                            label="Position"
                            placeholder={
                                loadingOffices
                                    ? "Loading positions..."
                                    : "Enter your current position"
                            }
                            items={positions} // Now, offices is guaranteed to be an array
                            keyField={"id"}
                            labelField="name"
                            menuTrigger="input"
                            onSelectionChange={(key: string) => {
                                clearErrors("position_id");
                                setData("position_id", key);
                            }}
                            isClearable={false}
                            errorMessage={errors.position_id || positionError}
                            isRequired
                            isDisabled={loadingPositions || !!positionError}
                        />
                        <Select
                            autocomplete={true}
                            variant="flat"
                            name="office_id"
                            label="Office"
                            placeholder={
                                loadingOffices
                                    ? "Loading offices..."
                                    : "Enter your office department/section/office"
                            }
                            items={offices} // Now, offices is guaranteed to be an array
                            keyField={"id"}
                            labelField="name"
                            menuTrigger="input"
                            onSelectionChange={(key: string) => {
                                clearErrors("office_id");
                                setData("office_id", key);
                            }}
                            isClearable={false}
                            errorMessage={errors.office_id || officesError}
                            isRequired
                            isDisabled={loadingOffices || !!officesError}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Input
                            name="first_name"
                            label="First Name"
                            placeholder="Enter your first name"
                            value={data.first_name}
                            onChange={(e) => {
                                clearErrors("first_name");
                                setData("first_name", e.target.value);
                            }}
                            errorMessage={errors.first_name}
                            variant="flat"
                            isRequired
                        />
                        <Input
                            name="middle_name"
                            label="Middle Name"
                            placeholder="Enter your middle name"
                            value={data.middle_name}
                            onChange={(e) => {
                                clearErrors("middle_name");
                                setData("middle_name", e.target.value);
                            }}
                            variant="flat"
                            errorMessage={errors.middle_name}
                        />
                        <Input
                            name="last_name"
                            label="Last Name"
                            placeholder="Enter your last name"
                            value={data.last_name}
                            onChange={(e) => {
                                clearErrors("last_name");
                                setData("last_name", e.target.value);
                            }}
                            variant="flat"
                            errorMessage={errors.last_name}
                            isRequired
                        />
                    </div>
                    <div className="flex gap-3">
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            placeholder="Enter your email"
                            value={data.email}
                            onChange={(e) => {
                                clearErrors("email");
                                setData("email", e.target.value);
                            }}
                            variant="flat"
                            errorMessage={errors.email}
                            isRequired
                        />
                        <Input
                            label="Contact Number"
                            name="contact_no"
                            placeholder="Enter your contact number"
                            value={data.contact_no}
                            onChange={(e) => {
                                clearErrors("contact_no");
                                setData("contact_no", e.target.value);
                            }}
                            variant="flat"
                            errorMessage={errors.contact_no}
                            isRequired
                        />
                    </div>

                    <div className="flex gap-3">
                        <PasswordInput
                            name="password"
                            label="Password"
                            placeholder="Set your password"
                            value={data.password}
                            onChange={(e) => {
                                clearErrors("password");
                                setData("password", e.target.value);
                            }}
                            variant="flat"
                            errorMessage={errors.password}
                        />
                        <PasswordInput
                            name="password_confirmation"
                            label="Confirm password"
                            placeholder="Enter your password again"
                            value={data.password_confirmation}
                            onChange={(e) => {
                                clearErrors("password_confirmation");
                                setData(
                                    "password_confirmation",
                                    e.target.value
                                );
                            }}
                            variant="flat"
                            errorMessage={errors.password_confirmation}
                        />
                    </div>

                    <div className="flex items-center justify-end ">
                        <Button
                            className="ms-4"
                            color="primary"
                            isLoading={processing}
                            type="submit"
                        >
                            Register as Administrator
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default RegisterForm;
