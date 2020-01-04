const webpack = require("webpack");

module.exports = {
    chainWebpack: (config) => {
        // https://github.com/vuejs/vue-cli/issues/1647#issuecomment-459650275
        config.plugin('define').tap((definitions) => {
            definitions[0]['process.env']['PACKAGE_VERSION'] = JSON.stringify(require('./package.json').version);
            return definitions;
        });
    }
};
