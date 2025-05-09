// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Development Wiki",
  tagline: "A comprehensive guide to modern web development",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://appitect-dev.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: "/wiki/",

  // GitHub pages deployment config.
  organizationName: "appitect-dev",
  projectName: "wiki",
  trailingSlash: false,

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/appitect-dev/wiki/tree/main/",
          routeBasePath: "/", // Serve the docs at the site's root
        },
        blog: false, // Optional: disable blog plugin
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Appitect development wiki & knowledge base",
        logo: {
          alt: "Appitect Logo",
          src: "/appitect-logo.svg",
        },
        items: [
          // {
          //   type: "docSidebar",
          //   sidebarId: "tutorialSidebar",
          //   position: "left",
          //   label: "Tutorial",
          // },
          {
            href: "https://github.com/appitect-dev/wiki",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/",
              },
              {
                label: "Frontend Development",
                to: "/frontend/overview",
              },
              {
                label: "Backend Development",
                to: "/backend/overview",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/appitect-dev",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Your Organization. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
        additionalLanguages: ["typescript", "tsx", "bash", "json", "markdown"],
      },
    }),
};

module.exports = config;
