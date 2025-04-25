/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'index',
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
      items: ['frontend/overview'],
    },
    {
      type: 'category',
      label: 'Backend Development',
      items: ['backend/overview'],
    },
    {
      type: 'category',
      label: 'Development Tools',
      items: ['tools/git-guide'],
    },
  ],
};

module.exports = sidebars; 