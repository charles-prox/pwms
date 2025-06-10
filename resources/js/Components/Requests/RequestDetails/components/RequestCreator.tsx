import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Divider,
    User,
    Spacer,
} from "@heroui/react";
import useFetch from "@/Hooks/useFetch";
import { toTitleCase, url } from "@/Utils/helpers";

interface RequestuserProps {
    userId: number;
}

const Requestuser: React.FC<RequestuserProps> = ({ userId }) => {
    const {
        data: user,
        loading: loadingUser,
        error,
    } = useFetch<any>(route("users.show", { id: userId }));

    return (
        <Card className="p-3">
            <CardBody>
                <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
                    Request Created By:
                </p>
                <div>
                    <User
                        avatarProps={{
                            src: user.profile_photo_url,
                            size: "lg",
                        }}
                        name={<p className="text-lg">{user.full_name}</p>}
                        description={<p className="text-sm">{user.position}</p>}
                    />
                </div>
                <Spacer y={4} />
                <div className="space-y-2">
                    {[
                        { label: "Email", value: user.email },
                        { label: "Contact Number", value: user.contact_number },
                        { label: "HRIS ID", value: user.hris_id },
                        {
                            label: "Employment Status",
                            value: user.employment_status,
                        },
                        { label: "Account Status", value: user.account_status },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex justify-start items-center pb-1"
                        >
                            <p className="text-tiny text-default-600 w-32">
                                {item.label}:
                            </p>
                            <p className="text-tiny font-semibold">
                                {item.value ? toTitleCase(item.value) : "—"}
                            </p>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default Requestuser;
