import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/client";
import Spinner from "../component/Spinner";
import moment from "moment";
const withAuth = (WrappedComponent) => {
    
    return (props) => {
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [token, setToken] = useState("");
        const [user, setUser] = useState({ uid: "", fullName: "", photo: "" });

        const [verified, setVerified] = useState(false);
        useEffect(() => {
            let path;
            if (
                router.pathname.startsWith("/account/") ||
                router.pathname.startsWith("/vendor/") ||
                router.pathname.startsWith("/order-tracking") ||
                router.pathname.startsWith("/checkout/")
            ) {
                path = "/";
            } else if (
                router.pathname.startsWith("/vendor/profile") ||
                router.pathname.startsWith("/vendor/changePassword") ||
                router.pathname.startsWith("/vendor/sales") ||
                router.pathname.startsWith("/vendor/products") ||
                router.pathname.startsWith("/vendor/productAdd") ||
                router.pathname.startsWith("/vendor/productEdit")
            ) {
                path = "/vendor";
            } else if (router.pathname.startsWith("/superadmin/dashboard")) {
                path = "/superadmin";
            }
            const securePage = async () => {
                const session = await getSession();
                let tempUser;
                let role;

                if (!session) {
                    router.push({
                        pathname: path,
                        query: { callback: router.pathname },
                        shallow: true,
                    });
                } else {
                    tempUser = session.user;

                    if (tempUser.role === "USER") {
                        // role = "user";
                        role = [
                            { type: "account" },
                            { type: "checkout" },
                            { type: "order-tracking" },
                        ];
                    } else if (tempUser.role === "VENDOR") {
                        // role = "vendor";
                        role = [{ type: "vendor" }];
                    } else if (tempUser.role === "ADMIN") {
                        // role = "superadmin";
                        role = [{ type: "superadmin" }];
                    }
                    if (
                        moment(
                            tempUser.expires,
                            moment.ISO_8601,
                            true
                        ).isBefore()
                    ) {
                        await signOut({ redirect: false });
                        router.push({
                            pathname: path,
                            query: { callback: router.pathname },
                            shallow: true,
                        });
                    } else {
                        if (tempUser.role === "USER") {
                            if (
                                router.pathname.includes(role[0].type) ||
                                router.pathname.includes(role[1].type) ||
                                router.pathname.includes(role[2].type)
                            ) {
                                if (tempUser.fullName) {
                                    setUser({
                                        fullname: tempUser.fullName,
                                        photo: tempUser.photo,
                                        role: tempUser.role,
                                    });
                                }
                                setToken(session.accessToken);
                                setLoading(false);
                            } else {
                                router.replace({
                                    pathname: path,
                                    query: { callback: router.pathname },
                                    shallow: true,
                                });
                            }
                        }
                        if (tempUser.role === "VENDOR") {
                            if (router.pathname.includes(role[0].type)) {
                                if (tempUser.fullName) {
                                    setUser({
                                        fullname: tempUser.fullName,
                                        photo: tempUser.photo,
                                        role: tempUser.role,
                                    });
                                }
                                setToken(session.accessToken);
                                setLoading(false);
                            } else {
                                router.replace({
                                    pathname: path,
                                    query: { callback: router.pathname },
                                    shallow: true,
                                });
                            }
                        }
                        if (tempUser.role === "ADMIN") {
                            if (router.pathname.includes(role[0].type)) {
                                if (tempUser.fullName) {
                                    setUser({
                                        fullname: tempUser.fullName,
                                        photo: tempUser.photo,
                                        role: tempUser.role,
                                    });
                                }
                                setToken(session.accessToken);
                                setLoading(false);
                            } else {
                                router.replace({
                                    pathname: path,
                                    query: { callback: router.pathname },
                                    shallow: true,
                                });
                            }
                        }
                    }
                }
            };
            securePage();
        }, []);

        if (loading) {
            return (
                <h1 className="text-center">
                    <Spinner />
                </h1>
            );
        } else {
            return <WrappedComponent {...props} token={token} user={user} />;
        }
    };
};

export default withAuth;
