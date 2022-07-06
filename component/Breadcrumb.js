import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Link from "next/link";


const convertBreadcrumb = string => {
    return string
        .replace(/-/g, ' ')
        .replace(/%20/g, " ")
        .replace("And", " & ")
        // .replace(/oe/g, 'ö')
        // .replace(/ae/g, 'ä')
        // .replace(/ue/g, 'ü')
        .toUpperCase();
};

const Breadcrumb = () => {
    const router = useRouter();
    const parentTab = router.pathname.startsWith("/account");
    const parentCheckout = router.pathname.startsWith("/checkout");
    const parentCategory = router.pathname.startsWith("/category");
    const activeTab = router.asPath.split("/").pop();
    // const pathTree = router.asPath.split("/");

    // const linkPath = router.asPath.split('/');
    // linkPath.shift();
    // const pathArray = linkPath.map((path, i) => {
    //     console.log("path", path);
    //     return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') };
    // });
    // console.log("pathArray", pathArray)

    const [breadcrumbs, setBreadcrumbs] = useState(null);

    useEffect(() => {
        if (router) {
            const linkPath = router.asPath.split('/');
            linkPath.shift();

            const pathArray = linkPath.map((path, i) => {
                return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') };
            });

            setBreadcrumbs(pathArray);
        }
    }, [router]);

    if (!breadcrumbs) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-dark flex-lg-nowrap justify-content-center justify-content-lg-start float-right">
                <li className="breadcrumb-item">
                    <Link href="/">
                        <a className="text-nowrap text-white">
                            <i className="czi-home" />
                            HOME
                        </a>
                    </Link>
                </li>

                {!activeTab.includes("shop") &&
                    !activeTab.includes("category") &&
                    activeTab !== "contact" &&
                    activeTab !== "about" &&
                    activeTab !== "help" &&
                    activeTab !== "faq" &&
                    activeTab !== "blog" &&
                    activeTab !== "cart" &&
                    activeTab !== "promoCode" && (
                        <li className="breadcrumb-item text-nowrap text-uppercase">
                            {
                                (parentCategory) ?
                                    <Link href={parentTab ? "/account/setting" : "/"} >
                                        <a className="text-white"> {parentTab ? "Account" : "Category"}</a>
                                    </Link>
                                    : (parentCheckout) ?
                                        <Link href={parentTab ? "/account/setting" : "/cart"} >
                                            <a className="text-white"> {parentTab ? "Account" : "Checkout"}</a>
                                        </Link>
                                        :
                                        <Link href={parentTab ? "/account/setting" : "/shop"} >
                                            <a className="text-white"> {parentTab ? "Account" : "Shop"}</a>
                                        </Link>
                            }
                        </li>
                    )}

                {/* {pathTree.length > 3 &&
                    pathTree.map((d, index) => {
                        if ((index > 0) & (index < pathTree.length - 1)) {
                            return (
                                d !== "shop" && (
                                    <li
                                        className="breadcrumb-item text-nowrap"
                                        key={index}
                                    >
                                        
                                        <Link href={`${d}`} >
                                            
                                            <a className="text-white"> {d?.replace(/%20/g, " ")}</a>
                                        </Link>
                                    </li>
                                )
                            );
                        }
                    })} */}

                {/* {pathArray.length > 3 &&
                    pathArray.map((d, index) => {
                        if ((index > 0) & (index < pathArray.length - 1)) {
                            return (
                                d !== "shop" && (
                                    <li
                                        className="breadcrumb-item text-nowrap"
                                        key={index}
                                    >
                                        <Link href={`${d.href}`}>
                                            <a className="text-white"> {d?.breadcrumb}</a>
                                        </Link>
                                    </li>
                                )
                            );
                        }
                    })} */}
                {breadcrumbs.length > 2 &&
                    breadcrumbs.map((breadcrumb, index) => {
                        if ((index > 0) && (index < breadcrumbs.length - 1)) {
                            return (
                                <li key={breadcrumb.href} className="breadcrumb-item text-nowrap">
                                    <Link href={breadcrumb.href}>
                                        <a className="text-white text-uppercase">
                                            {/* {console.log(breadcrumb.breadcrumb)} */}
                                            {convertBreadcrumb(breadcrumb.breadcrumb)}
                                        </a>
                                    </Link>
                                </li>
                            );
                        }
                    })
                }

                {router.query.page ? (
                    <li
                        className="breadcrumb-item text-nowrap active text-white"
                        aria-current="page"
                    >
                        Shop
                    </li>
                ) : (
                    <li
                        className="breadcrumb-item text-nowrap active text-white"
                        aria-current="page"
                    >
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace("_", " ").replace("And", " & ")}
                    </li>
                )}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
