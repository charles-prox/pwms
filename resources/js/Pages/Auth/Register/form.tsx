import React from "react";
import { employmentStatus } from "@/Utils/constants";
import PasswordInput from "@/Components/Shared/PasswordInput";
import Select from "@/Components/Shared/Select";
import { useForm } from "@inertiajs/react";
import { Button } from "@heroui/react";
import useFetch from "@/Hooks/useFetch";
import Input from "@/Components/Shared/Input";

const RegisterForm = () => {
    const {
        data: offices,
        loading: loadingOffices,
        error: officesError,
    } = useFetch<any[]>(route("offices"));
    const { data, setData, post, processing, errors, reset } = useForm({
        hris_id: "",
        user_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
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
                            onChange={(e) => setData("hris_id", e.target.value)}
                            variant="flat"
                            errorMessage={errors.hris_id}
                            isRequired
                        />
                        <Input
                            name="user_id"
                            label="User ID"
                            placeholder="Enter your desired User ID"
                            value={data.user_id}
                            onChange={(e) => setData("user_id", e.target.value)}
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
                                setData("employment_status", key);
                            }}
                            isClearable={false}
                            errorMessage={errors.employment_status}
                            isRequired
                        />
                    </div>
                    <div className="flex gap-3">
                        <Input
                            name="position"
                            label="Position"
                            placeholder="Enter your current position"
                            value={data.position}
                            onChange={(e) =>
                                setData("position", e.target.value)
                            }
                            errorMessage={errors.position}
                            variant="flat"
                            isRequired
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
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            errorMessage={errors.first_name}
                            variant="flat"
                            isRequired
                        />
                        <Input
                            name="middle_name"
                            label="Middle Name"
                            placeholder="Enter your middle name"
                            value={data.middle_name}
                            onChange={(e) =>
                                setData("middle_name", e.target.value)
                            }
                            variant="flat"
                            errorMessage={errors.middle_name}
                        />
                        <Input
                            name="last_name"
                            label="Last Name"
                            placeholder="Enter your last name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
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
                            onChange={(e) => setData("email", e.target.value)}
                            variant="flat"
                            errorMessage={errors.email}
                            isRequired
                        />
                        <Input
                            label="Contact Number"
                            name="contact_no"
                            placeholder="Enter your contact number"
                            value={data.contact_no}
                            onChange={(e) =>
                                setData("contact_no", e.target.value)
                            }
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
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            variant="flat"
                            errorMessage={errors.password}
                        />
                        <PasswordInput
                            name="password_confirmation"
                            label="Confirm password"
                            placeholder="Enter your password again"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
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
