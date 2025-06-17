import { Column } from "@/Layouts/BaseListView";
import { UserType } from "@/Utils/types";
import { User } from "@heroui/react";

export const columns: Column<UserType>[] = [
    {
        label: "Name",
        key: "name",
        render: (user: UserType) => {
            return (
                <User
                    avatarProps={{
                        src: user.profile_photo_url,
                    }}
                    description={user.hris_id}
                    name={user.full_name}
                />
            );
        },
    },
    {
        label: "Position",
        key: "position",
        render: (user: UserType) => {
            return user.position?.name || "--";
        },
    },
    {
        label: "Office",
        key: "office",
        render: (user: UserType) => {
            return user.office?.name;
        },
    },
    {
        label: "Status",
        key: "status",
        render: (user: UserType) => {
            return user.account_status;
        },
    },
    {
        label: "ACTIONS",
        key: "actions",
        render: (user: UserType)=> {
            return (
                
            )
        }
    },
];
