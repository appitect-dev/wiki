/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Fundamentals',
      items: ['fundamentals/basic-concepts'],
    },
    {
      type: 'category',
      label: 'Frontend Development',
      items: [
        'frontend/overview',
        'frontend/react',
        'frontend/nextjs',
        'frontend/typescript',
        'frontend/tailwind',
      ],
    },
    {
      type: 'category',
      label: 'Backend Development',
      items: [
        'backend/overview',
        'backend/spring-boot',
        'backend/java',
        'backend/maven',
        'backend/api-docs',
      ],
    },
    {
      type: 'category',
      label: 'Development Tools',
      items: [
        'tools/git-guide',
        'tools/ide-setup',
        'tools/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Best Practices',
      items: [
        'best-practices/code-style',
        'best-practices/testing',
        'best-practices/security',
        'best-practices/performance',
      ],
    },
  ],
};

module.exports = sidebars; 