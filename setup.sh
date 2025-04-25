#!/bin/bash

# Create necessary directories
mkdir -p docs/{fundamentals,frontend,backend,tools,best-practices}
mkdir -p src/css
mkdir -p static/img

# Install dependencies
npm install

# Create placeholder files for required images
touch static/img/favicon.ico
touch static/img/logo.svg
touch static/img/docusaurus-social-card.jpg

# Create necessary documentation directories
mkdir -p docs/frontend/{react,nextjs,typescript,tailwind}
mkdir -p docs/backend/{spring-boot,java,maven,api-docs}
mkdir -p docs/best-practices/{code-style,testing,security,performance}

echo "Setup complete! You can now run 'npm start' to start the development server." 