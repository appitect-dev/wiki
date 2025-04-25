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
    component: ComponentCreator('/wiki/', 'b8e'),
    routes: [
      {
        path: '/wiki/',
        component: ComponentCreator('/wiki/', '994'),
        routes: [
          {
            path: '/wiki/',
            component: ComponentCreator('/wiki/', '30e'),
            routes: [
              {
                path: '/wiki/backend/api-docs',
                component: ComponentCreator('/wiki/backend/api-docs', '916'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/backend/database',
                component: ComponentCreator('/wiki/backend/database', '2ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/backend/jpa-hibernate',
                component: ComponentCreator('/wiki/backend/jpa-hibernate', '533'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/backend/overview',
                component: ComponentCreator('/wiki/backend/overview', 'c4b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/backend/project-setup',
                component: ComponentCreator('/wiki/backend/project-setup', '86f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/backend/rest-api',
                component: ComponentCreator('/wiki/backend/rest-api', '8e8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/backend/security',
                component: ComponentCreator('/wiki/backend/security', '08b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/frontend/backend-integration',
                component: ComponentCreator('/wiki/frontend/backend-integration', 'a3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/frontend/components',
                component: ComponentCreator('/wiki/frontend/components', 'feb'),
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
                path: '/wiki/frontend/project-setup',
                component: ComponentCreator('/wiki/frontend/project-setup', 'f9c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/frontend/state-management',
                component: ComponentCreator('/wiki/frontend/state-management', '76e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/wiki/fundamentals/overview',
                component: ComponentCreator('/wiki/fundamentals/overview', '663'),
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
