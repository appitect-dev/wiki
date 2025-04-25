import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/wiki/__docusaurus/debug',
    component: ComponentCreator('/wiki/__docusaurus/debug', '81f'),
    exact: true
  },
  {
    path: '/wiki/__docusaurus/debug/config',
    component: ComponentCreator('/wiki/__docusaurus/debug/config', '3ed'),
    exact: true
  },
  {
    path: '/wiki/__docusaurus/debug/content',
    component: ComponentCreator('/wiki/__docusaurus/debug/content', '57c'),
    exact: true
  },
  {
    path: '/wiki/__docusaurus/debug/globalData',
    component: ComponentCreator('/wiki/__docusaurus/debug/globalData', '7f8'),
    exact: true
  },
  {
    path: '/wiki/__docusaurus/debug/metadata',
    component: ComponentCreator('/wiki/__docusaurus/debug/metadata', '3ab'),
    exact: true
  },
  {
    path: '/wiki/__docusaurus/debug/registry',
    component: ComponentCreator('/wiki/__docusaurus/debug/registry', 'ae5'),
    exact: true
  },
  {
    path: '/wiki/__docusaurus/debug/routes',
    component: ComponentCreator('/wiki/__docusaurus/debug/routes', '0dc'),
    exact: true
  },
  {
    path: '/wiki/',
    component: ComponentCreator('/wiki/', 'bd7'),
    routes: [
      {
        path: '/wiki/',
        component: ComponentCreator('/wiki/', '9ce'),
        routes: [
          {
            path: '/wiki/',
            component: ComponentCreator('/wiki/', '8cb'),
            routes: [
              {
                path: '/wiki/backend/overview',
                component: ComponentCreator('/wiki/backend/overview', 'c4b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/frontend/overview',
                component: ComponentCreator('/wiki/frontend/overview', 'fa3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/fundamentals/basic-concepts',
                component: ComponentCreator('/wiki/fundamentals/basic-concepts', '9c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/tools/git-guide',
                component: ComponentCreator('/wiki/tools/git-guide', 'bce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/',
                component: ComponentCreator('/wiki/', '71d'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
