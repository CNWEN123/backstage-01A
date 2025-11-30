#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '../dist/_routes.json');

const correctRoutes = {
  version: 1,
  include: ['/*'],
  exclude: ['/static/*']
};

fs.writeFileSync(routesPath, JSON.stringify(correctRoutes, null, 2));
console.log('✅ _routes.json 已修复 - /agent.html 将通过 Worker 处理');
