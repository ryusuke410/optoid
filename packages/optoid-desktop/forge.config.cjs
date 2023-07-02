/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs-extra');

const readRawPackageJsonSync = (dir) => fs.readJsonSync(path.resolve(dir, 'package.json'));
const readPackageJsonSync = () => readRawPackageJsonSync(__dirname);
const packageJSON = readPackageJsonSync();

module.exports = {
  "packagerConfig": {},
  "rebuildConfig": {},
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "optoid_desktop",
        "setupExe": `optoid-desktop-${packageJSON.version}_Setup.exe`
      }
    },
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {}
    },
    {
      "name": "@electron-forge/maker-rpm",
      "config": {}
    }
  ],
  "plugins": [
    {
      "name": "@electron-forge/plugin-vite",
      "config": {
        "build": [
          {
            "entry": "src/main.ts",
            "config": "vite.main.config.ts"
          },
          {
            "entry": "src/preload.ts",
            "config": "vite.preload.config.ts"
          }
        ],
        "renderer": [
          {
            "name": "main_window",
            "config": "vite.renderer.config.ts"
          }
        ]
      }
    }
  ],
  "publishers": [
    {
      "name": "@electron-forge/publisher-github",
      "config": {
        "repository": {
          "owner": "ryusuke410",
          "name": "optoid",
          "draft": true
        },
        "tagPrefix": "desktop-v"
      }
    }
  ]
}