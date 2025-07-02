// src/Services/boxCodeService.ts
import { axiosInstance } from "@/Utils/axios";

/**
 * Fetches a generated box code from the backend for a given office ID.
 * You can pass the number of unsaved boxes to avoid duplicate codes.
 *
 * @param officeId - The ID of the office
 * @param existingCount - Number of boxes already generated but not yet saved (optional)
 * @returns A promise that resolves to the generated box code string
 */
export async function fetchGeneratedBoxCode(
    officeId: number,
    existingCount: number = 0
): Promise<string> {
    try {
        const response = await axiosInstance.get(
            `/requests/generate-box-code/${officeId}`,
            {
                params: { existingCount },
            }
        );
        return response.data.box_code;
    } catch (error) {
        console.error("Failed to fetch box code:", error);
        throw new Error("Could not generate box code");
    }
}
