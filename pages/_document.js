import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }
    render() {
        return (
            <Html>
                <Head>
                    <link rel="shortcut icon" href="/img/logo.png" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <link
                        rel="stylesheet"
                        href="/vendor/simplebar/dist/simplebar.min.css"
                    />
                    <link
                        rel="stylesheet"
                        href="/vendor/tiny-slider/dist/tiny-slider.css"
                    />
                    <link
                        rel="stylesheet"
                        href="/vendor/drift-zoom/dist/drift-basic.min.css"
                    />
                    <link
                        rel="stylesheet"
                        href="/vendor/nouislider/distribute/nouislider.min.css"
                    />
                    <link rel="stylesheet" href="/css/theme.min.css" />
                    {/* <link rel="stylesheet" href="/css/wizard.css" /> */}
                    <script src="/vendor/card/dist/card.js"></script>
                    <script src="/vendor/jquery/dist/jquery.slim.min.js"></script>
                    <script src="/vendor/bs-custom-file-input/dist/bs-custom-file-input.min.js"></script>
                    <script src="/vendor/tiny-slider/dist/min/tiny-slider.js"></script>
                    <script src="/vendor/drift-zoom/dist/Drift.min.js"></script>
                    <script src="/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
                    {/* <script src="/vendor/simplebar/dist/simplebar.min.js"></script> */}
                    <script src="/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js"></script>
                    <script src="/vendor/nouislider/distribute/nouislider.min.js"></script>
                    <script src="/js/theme.min.js"></script>
                </Head>
                <body>
                    <noscript>
                        <iframe
                            src="http://www.googletagmanager.com/ns.html?id=GTM-WKV3GT5"
                            height="0"
                            width="0"
                            style={{ display: `none`, visibility: `hidden` }}
                        ></iframe>
                    </noscript>
                    <div id="modalRoot"></div>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
