// src/Services/boxCodeService.ts
import { axiosInstance } from "@/Utils/axios";

/**
 * Fetches a generated box code from the backend for a given office ID.
 *
 * @param officeId - The ID of the office
 * @returns A promise that resolves to the generated box code string
 */
export async function fetchGeneratedBoxCode(officeId: number): Promise<string> {
    try {
        const response = await axiosInstance.get(
            `/requests/generate-box-code/${officeId}`
        );
        return response.data.box_code;
    } catch (error) {
        console.error("Failed to fetch box code:", error);
        throw new Error("Could not generate box code");
    }
}
