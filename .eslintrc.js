module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb",
        "plugin:@typescript-eslint/recommended"
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
    "plugins": [
        "react",
        "typescript",
        "react-hooks",
        "@typescript-eslint"
      ],
      "rules": {
        "import/extensions": [
            "error",
            "ignorePackages",
            {
              "js": "never",
              "jsx": "never",
              "ts": "never",
              "tsx": "never"
            }
         ],
       "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".jsx"] }],
        "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}],
        "no-underscore-dangle": "off",
        "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
      },
      "settings": {
        "import/resolver": {
          "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx"]
          }
        }
      },
};
