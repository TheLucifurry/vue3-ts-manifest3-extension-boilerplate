# vue3-ts-manifest3-extension-boilerplate
A boilerplate for easy setup & developing modern (MV3) browser extensions based on Vue 3 and Typescript
# Features
  1. Config for auto-gen of pages (popup, options etc.)
  1. Basic locales support
  1. Full minification (code chunking, images &  other static files minifying)
  1. Convenient editing of manifest: comments support, auto-add info 

# Getting started
 1. Clone this repo ```git clone https://github.com/Wexelus/vue3-ts-manifest3-extension-boilerplate.git```
 1. Install dependencies ```npm install```
 1. Read the [docs](#documentation) and configure your project
 1. Edit package.json and remove unnecessary files (.git, README.md etc.)
 1. Star this repo if I helped you :)

# Documentation
  1. To create new page, add the new config to [PAGES in webpack config](webpack.config.js#L20) and create the entry point script with root vue component (like [src/components/popup](src/components/popup))
  2. By default, the manifest gets fields **version** and **author** from package.json on build, I would recommend following this rule :) ([see "editManifest" function](webpack.utils.js#L40)))