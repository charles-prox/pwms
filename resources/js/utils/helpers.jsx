/**
 * This file contains utility functions and helper methods that are used throughout the project.
 * These functions perform common operations or transformations that are not tied to a specific
 * component or module but are needed in multiple places across the codebase.
 *
 * By centralizing these functions in this file, we promote code reusability and maintainability,
 * avoiding duplication and keeping helper logic organized in one place.
 *
 * Example:
 * - `formatDate`: A function to format date strings consistently.
 * - `calculateTotal`: A function to calculate totals from an array of values.
 *
 * All functions exported from this file should be generic and reusable to support various parts of the application.
 * -------------------------------------------------------------------------------------------------------------------
 */

/**
 * Import statements for external libraries and modules.
 * -------------------------------------------------------------------------------------------------------------------
 * This section is reserved for importing third-party libraries, frameworks, and other
 * modules required by the helper functions or the code in this file.
 *
 * Imports may include:
 * - External libraries (e.g., `axios`, `he`)
 * - Internal modules or components from other parts of the project
 *
 * Organize imports logically and group them by type (e.g., third-party libraries, internal modules).
 * -------------------------------------------------------------------------------------------------------------------
 */
import axios from "axios";

/**
 * Functions and helper methods used across the application.
 * -------------------------------------------------------------------------------------------------------------------
 * This section is designated for utility functions and helper methods that provide
 * commonly needed functionality or transformations throughout the project. These functions
 * are designed to be reusable and should avoid coupling with specific components or modules.
 *
 * Each function should be:
 * - **Generic**: Applicable to various parts of the application.
 * - **Reusable**: Avoid duplicating logic by centralizing commonly used code.
 * - **Well-Documented**: Include comments and documentation for clarity and maintainability.
 * -------------------------------------------------------------------------------------------------------------------
 */

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

/**
 * Generates a URL for displaying images stored in the storage folder that is linked to the public directory.
 *
 * @param {string} path - The relative path of the image within the storage folder.
 * @returns {string} - The full URL to access the image.
 */
export const asset = (path) => {
    return `/storage/images/${path}`;
};

/**
 * Generates a URL for displaying any assets stored in the storage folder that is linked to the public directory.
 *
 * @param {string} path - The relative path of the image within the storage folder.
 * @returns {string} - The full URL to access the image.
 */
export const url = (path) => {
    return `/storage/${path}`;
};

/**
 * Converts a given string to title case, where the first letter of each word is capitalized.
 *
 * @param {string} str - The input string to be converted.
 * @returns {string} - The converted string in title case.
 */
export const toTitleCase = (str) => {
    // Convert the entire string to lowercase to ensure uniformity
    str = str.toLowerCase();

    // Split the string into an array of words, map over each word to capitalize the first letter,
    // then join the array back into a single string with spaces in between.
    return str
        .split(" ") // Split the string into words using space as the delimiter
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(" "); // Join the words back into a single string with spaces in between
};

/**
 * Helper function to get the current date in MM/DD/YYYY format
 *
 * @returns {string} - The current date formatted in month/day/year.
 */
export const getCurrentDate = () => {
    // Create a new Date object representing the current date and time
    const now = new Date();

    // Get the full year (e.g., 2024)
    const year = now.getFullYear();

    // Get the month (0-11), add 1 to make it 1-12, and pad with leading zero if necessary
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Get the day of the month (1-31) and pad with leading zero if necessary
    const day = String(now.getDate()).padStart(2, "0");

    // Return the formatted date string in MM/DD/YYYY format
    return `${month}/${day}/${year}`;
};
