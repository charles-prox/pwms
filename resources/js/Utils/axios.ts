import axios from "axios";

/**
 * Creates an axios instance with default configurations for making HTTP requests.
 *
 * This instance is configured to include credentials (e.g., cookies) with requests
 * and has a default base URL for all requests made using this instance.
 *
 * @type {axios.AxiosInstance} - Configured instance of axios.
 */
// Create an axios instance with default configurations
export const axiosInstance = axios.create({
    baseURL: "/", // Update if you have a different base URL
    withCredentials: true, // Ensure cookies are sent with requests
});
