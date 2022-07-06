module.exports = {
    env: {
        // HOST: "http://localhost:3030",
        HOST: "https://vaistra-ecommerce-api.herokuapp.com", //for Final E-Commerce
        // HOST: "http://192.168.0.138:3030", //for Final E-Commerce

        RP_KEY_ID: "rzp_test_dH12aNfdtcZkWX",
    },
    reactStrictMode: true,
    publicRuntimeConfig: {
        staticFolder: "/static",
    },
    reactStrictMode: false,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
    distDir: "build",
    eslint: {
        ignoreDuringBuilds: true,
    },
};
