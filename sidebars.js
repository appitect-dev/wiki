/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: "doc",
      id: "index",
      label: "Introduction",
    },
    {
      type: "category",
      label: "Backend Development",
      items: [
        "backend/overview",
        "backend/project-setup",
        "backend/rest-api",
        "backend/database",
        "backend/jpa-hibernate",
        "backend/security",
        "backend/api-docs",
      ],
    },
    {
      type: "category",
      label: "Frontend Development",
      items: [
        "frontend/overview",
        "frontend/project-setup",
        "frontend/backend-integration",
        "frontend/components",
        "frontend/state-management",
      ],
    },
    {
      type: "category",
      label: "Fundamentals",
      items: ["fundamentals/overview"],
    },
  ],
};

module.exports = sidebars;
