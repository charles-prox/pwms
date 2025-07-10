#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get the page name from command-line arguments
const pageName = process.argv[2];

if (!pageName) {
    console.error(
        "❌ Please provide a page name: node create-page.js PageName"
    );
    process.exit(1);
}

const folderPath = path.join(__dirname, "../resources/js/Pages", pageName);
const filePath = path.join(folderPath, "page.tsx");

if (fs.existsSync(folderPath)) {
    console.error("❌ Page already exists.");
    process.exit(1);
}

// Create folder
fs.mkdirSync(folderPath, { recursive: true });

// Template content (adjust freely)
const template = `import React from "react";

const ${pageName}Page = () => {
    return (
        <div>
            <h1>${pageName} Page</h1>
            <p>This is the ${pageName} page.</p>
        </div>
    );
};

export default ${pageName}Page;
`;

fs.writeFileSync(filePath, template, "utf8");

console.log(`✅ Page created: resources/js/Pages/${pageName}/page.tsx`);
