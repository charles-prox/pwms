import { axiosInstance } from "@/Utils/axios";
import { BoxFormState } from "@/Utils/types";

export const searchBox = {
    async searchBoxes(query: string): Promise<BoxFormState[]> {
        try {
            const response = await axiosInstance.get<BoxFormState[]>(
                route("boxes.search"),
                {
                    params: { search: query },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Failed to search boxes:", error);
            throw error;
        }
    },
};
