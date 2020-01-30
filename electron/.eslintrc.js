module.exports = {
    "env": {
        "node": true
    },
    "extends": [
        "airbnb",
      ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "import/extensions": [
          "error",
          "ignorePackages",
          {
            "js": "never",
          }
        ],
      "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}],
      "no-underscore-dangle": "off",
      "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    },
    "settings": {
      "import/resolver": {
        "node": {
        "extensions": [".js"]
        }
      }
    },
};
