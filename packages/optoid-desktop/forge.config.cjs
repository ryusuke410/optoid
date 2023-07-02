/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs/promises');

const { bundle } = require('@black-moon-rewind/np-bundle');
const { version } = require('./package.json');

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log('ファイルが正常に削除されました。', filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('ファイルが存在しません。', filePath);
    } else {
      console.error('ファイルの削除中にエラーが発生しました:', error);
    }
  }
}

module.exports = {
  "packagerConfig": {},
  "rebuildConfig": {},
  "makers": [
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        "name": "optoid_desktop",
        "setupExe": `optoid-desktop-${version}_Setup.exe`
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
  ],
  hooks: {
    packageAfterCopy: async (forgeConfig, buildPath) => {
      await deleteFile(path.join(buildPath, '.env'));
      await deleteFile(path.join(buildPath, 'forge.config.cjs'));
      await bundle(__dirname, buildPath, {
        root: path.join(__dirname, '../..'),
      });
    },
  }
}