import { Button } from "@heroui/react";
import { Head, router } from "@inertiajs/react";

export default function Unauthorized() {
    return (
        <div className="flex h-screen items-center justify-center">
            <Head title="403" />
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-600">
                    403 - Forbidden
                </h1>
                <p className="my-2">
                    You do not have permission to view this page.
                </p>
                <Button onPress={() => router.visit("/")}>Go Back</Button>
            </div>
        </div>
    );
}
