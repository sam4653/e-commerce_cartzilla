import { useRouter } from "next/router";
import "../styles/customs.css";
import "../styles/globals.css";
import "../styles/commadmin.css";
import Header from "../component/Header";
import AdminHeader from "../component/admin/Header";
import MAdminHeader from "../component/madmin/Header";
import { Provider } from "react-redux";
import store from "../Redux/store";
import "../styles/swiper.scss";
import "react-input-range/lib/css/index.css";
import ProfileHeader from "../component/ProfileHeader";
import VProfileHeader from "../component/vendor/VProfileHeader";
import CheckoutHeader from "../component/CheckoutHeader";
import { Provider as AuthProvider } from "next-auth/client";


function MyApp({ Component, pageProps }) {
    const router = useRouter();
    return router.pathname === "/vendor" ||
        router.pathname === "/vendor/register" ||
        router.pathname === "/changePassword" ||
        router.pathname === "/forgotPassword" ||
        router.pathname === "/verifyOTP" ||
        router.pathname === "/ResetPassword" ? (
        <Component {...pageProps} />
    ) : router.pathname.startsWith("/vendor/profile") ||
      router.pathname.startsWith("/vendor/changePassword") ||
      router.pathname.startsWith("/vendor/sales") ||
      router.pathname.startsWith("/vendor/products") ||
      router.pathname.startsWith("/vendor/productAdd") ||
      router.pathname.startsWith("/vendor/gstVerify") ||
      router.pathname.startsWith("/vendor/bankDetails") ||
      router.pathname.startsWith("/vendor/pickUpAddress") ||
      router.pathname.startsWith("/vendor/productEdit") ||
      router.pathname.startsWith("/vendor/order") ? (
        <Provider store={store}>
            <Header>
                <VProfileHeader>
                    <Component {...pageProps} />
                </VProfileHeader>
            </Header>
        </Provider>
    ) : router.pathname.startsWith("/checkout") ? (
        <Provider store={store}>
            <Header>
                <CheckoutHeader>
                    <Component {...pageProps} />
                </CheckoutHeader>
            </Header>
        </Provider>
    ) : router.pathname.startsWith("/account") ? (
        <AuthProvider>
            <Provider store={store}>
                <Header>
                    <ProfileHeader>
                        <Component {...pageProps} />
                    </ProfileHeader>
                </Header>
            </Provider>
        </AuthProvider>
    ) : router.pathname === "/superadmin" ? (
        <Component {...pageProps} />
    ) : router.pathname.startsWith("/superadmin/Category") ||
      router.pathname.startsWith("/superadmin/dashboard") ||
      router.pathname.startsWith("/superadmin/Product") ||
      router.pathname.startsWith("/superadmin/Tickets") ? (
        <MAdminHeader>
            <Component {...pageProps} />
        </MAdminHeader>
    ) : (
        <AuthProvider>
            <Provider store={store}>
                <Header>
                    <Component {...pageProps} />
                </Header>
            </Provider>
        </AuthProvider>
    );
}

export default MyApp;
