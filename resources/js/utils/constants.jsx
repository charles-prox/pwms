/**
 * This file contains global constants that are used throughout the project.
 * These constants include configuration values, static data, and other fixed values
 * that are shared across multiple components or modules.
 *
 * By centralizing constants in this file, we ensure consistency and avoid magic strings
 * scattered throughout the codebase. This also makes it easier to update and manage
 * constants in a single location.
 *
 * ---------------------------------------------------------------------------------------
 */

/**
 * You can place your imports here
 * ---------------------------------------------------------------------------------------
 */

export const appName = import.meta.env.VITE_APP_NAME || "ArgusXCode";

/**
 * An array of objects representing different employment statuses.
 * Each object contains a label for display and a value for programmatic use.
 */
export const employmentStatus = [
    {
        label: "Regular",
        value: "regular",
    },
    {
        label: "Casual",
        value: "casual",
    },
    {
        label: "Job order/Contactual",
        value: "contractual",
    },
];
