import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// import { signOut } from "next-auth/client";
import {
  FaCompress,
  FaUser,
  FaChartPie,
  FaCog,
  FaBars,
  FaChartLine,
  FaUsers,
  FaDatabase,
  FaBuilding,
  FaSignOutAlt,
  FaInfo,
  FaInfoCircle,
  FaLayerGroup,
  FaShoppingBag,
} from "react-icons/fa";
import { useRouter } from "next/dist/client/router";
const Header = ({ children, token, user }) => {
  const year = new Date().getFullYear();
  const [sidebar, setSidebar] = useState(true);
  const minmax = () => {
    if (!window.screenTop && !window.screenY) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const router = useRouter();
  const logout = async () => {
    const res = await signOut({ redirect: false });
    router.replace("/v/superadmin/");
  };
  return (
    <>
      <Container style={{ overflow: "hidden" }}>
        <div className={sidebar ? "sidebarWrapper actives" : "sidebarWrapper"}>
          <div className="sidebarMenu">
            <nav>
              <div className="heading-section p-4 py-1 pt-3 d-flex align-items-center">
                <h3 className="pt-3 ps-3">VAISTRA</h3>
              </div>
              <hr />
              <p className="pt-4 px-4">Vendor Admin</p>
              <div className="menus mt-5" id="menus">
                <ul className="mt-4">
                  <li
                    className={`menu-item ${
                      router.pathname === "/admin" && `active`
                    }`}
                  >
                    <Link href="/admin">
                      <a className="menu-link" href="#">
                        <i>
                          <FaChartLine />
                        </i>
                        Dashboard
                      </a>
                    </Link>
                  </li>
                  <li
                    className={`menu-item ${
                      router.pathname.startsWith("/admin/product") && `active`
                    }`}
                  >
                    <Link href="/admin/product">
                      <a className="menu-link" href="#">
                        <i>
                          <FaLayerGroup />
                        </i>
                        Manage Product
                      </a>
                    </Link>
                  </li>
                  <li
                    className={`menu-item ${
                      router.pathname.startsWith("/admin/order") && `active`
                    }`}
                  >
                    <Link href="/admin/product">
                      <a className="menu-link" href="#">
                        <i>
                          <FaShoppingBag />
                        </i>
                        Manage Order
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="sidebarContent">
            <nav className="navbar navbar-light bg-light py-3 px-2 shadow">
              <div className="container-fluid">
                <div
                  className="toggle-menu"
                  onClick={() => setSidebar(!sidebar)}
                >
                  <span>
                    <FaBars />
                  </span>
                </div>

                <div className="right position-relative d-flex align-items-center flex-wrap">
                  <div className="minimize" onClick={() => minmax()}>
                    <i>
                      <FaCompress />
                    </i>
                  </div>
                  {/* <img
                    src="/assets/icons/avtar.png"
                    height="45"
                    width="45"
                    className="rounded-circle dropdown_avtar"
                  /> */}
                  <div className="custom-dropdown">
                    <ul>
                      <li className="info">
                        <i className="me-2">
                          <FaUser />
                        </i>
                        {/* {user.uname} */}
                      </li>
                      <li className="divider"></li>
                      {/* <li>
                        <i className="me-2">
                          <FaInfo />
                        </i>
                        Profile
                      </li> */}
                      {/* <li
                        onClick={() =>
                          router.replace("/v/superadmin/changepassword/")
                        }
                      >
                        <i className="me-2">
                          <FaInfoCircle />
                        </i>
                        Change Password
                      </li> */}
                      <li className="divider"></li>
                      <li className="" onClick={logout}>
                        <i className="me-2">
                          <FaSignOutAlt />
                        </i>
                        Logout
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
            <div className="container-fluid pb-5 h-100">
              {React.cloneElement(children, {
                token: token,
              })}
            </div>
          </div>
          {/* <AdSupFooter /> */}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  p {
    margin-bottom: 0px !important;
  }
  img {
    object-fit: cover;
  }
  .dropdown_avtar:hover + .custom-dropdown {
    transform: scale(1);
    opacity: 1;
    pointer-events: all;
  }
  .custom-dropdown {
    color: #1b5583;
    z-index: 1;
    position: absolute;
    pointer-events: none;
    background-color: #fff;
    height: auto;
    width: auto;
    top: 100%;
    right: 10%;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    overflow: hidden;
    transition: 0.4s all;
    transform-origin: top right;
    opacity: 0;
    transform: scale(0.5);
    &:hover {
      transform: scale(1);
      opacity: 1;
      pointer-events: all;
    }

    ul {
      margin: 0px;
      width: 190px;
      list-style-type: none;
      display: flex;
      flex-direction: column;
      padding: 0px;
      li {
        display: flex;
        align-items: center;
        padding: 8px 9px;
        cursor: pointer;
        word-break: normal !important;
        transition: 0.5s all;
        &:nth-child(3) {
          text-decoration: line-through;
        }
        /* &:nth-child(4) {
          text-decoration: line-through!important;
        } */
        &.divider {
          height: 1px;
          width: 80%;
          padding: 0px;
          margin: 0 auto;
          background-color: rgba(0, 0, 0, 0.3);
        }
        &.info {
          padding: 15px 9px;
        }
        &:hover:not(.divider, .info) {
          background-color: #ccc;
        }

        /* background-color: ivory; */
      }
    }
  }
  max-width: 100%;
  /* overflow: hidden; */
  .menu-head {
    font-size: 17px;
  }
  .sidebarWrapper {
    background-color: #fff;
    width: 100%;
    /* overflow: hidden !important; */
    position: relative;
    min-height: 100vh;

    .sidebarMenu {
      position: fixed;
      height: 100%;
      width: 260px;
      overflow: hidden;
      z-index: 37;
      background-color: #373f50;
      box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.2);
      transition: 0.5s all;
      color: #fff;
      transform: translateX(-100%);

      .heading-section {
        h3 {
          color: #fff;
        }
      }
      .dropdown {
        a {
          text-decoration: none;
          color: #fff;
        }
        .dropdown-menu {
          a {
            color: #000;
          }
        }
      }
      .menus {
        ul {
          list-style-type: none;
          padding: 0px;

          .menu-item {
            /* padding: 0px 22px; */
            padding: 0px 22px;
            margin-top: 10px;
            border-left: 5px solid #803535;

            &.active {
              background: linear-gradient(90deg, #bd4e4f, transparent);
              border-left: 5px solid #803535;

              .menu-link {
                color: #fff;
              }
            }
            /* li {
            } */
            &.dropcustom {
              .menu-link[aria-expanded="false"] {
                &:after {
                  top: 25%;
                  transform: translateY(-50%);
                  right: 0%;
                  content: "<";
                  place-content: initial;
                  position: absolute;
                  color: #fff;
                  font-size: 16px;
                  line-height: 16px;
                  transition: 0.5s all;
                  width: fit-content;
                  transform: rotate(-90deg);
                  /* background-color: lavender; */
                  /* transform-origin: center; */
                }
              }
              .menu-link[aria-expanded="true"] {
                &:after {
                  top: 25%;
                  transform: translateY(-50%);
                  right: 0%;
                  content: "<";
                  place-content: initial;
                  position: absolute;
                  color: #fff;
                  font-size: 16px;
                  line-height: 16px;
                  transition: 0.5s all;
                  width: fit-content;
                  transform: rotate(90deg);
                }
              }
            }
            .menu-link {
              position: relative;
              display: block;
              text-decoration: none;
              color: #c7c7c7;
              display: flex;
              padding: 10px 0px;
              /* width: 100%; */
              align-items: center;

              i {
                display: flex;
                align-items: center;
                margin-right: 20px;
              }
            }
          }
        }
        .menu-dropdown {
          padding-left: 60px;
          li {
            margin-top: 10px;
            width: 100%;
            overflow: hidden;
            a {
              text-decoration: none;
              font-size: 14px;
              color: #ccc;
              &:hover {
                color: #fff;
              }
              &:before {
                position: absolute;
              }
            }
          }
        }
      }
    }
    .sidebarContent {
      position: absolute;
      background-color: #f5f7fb;
      width: 100%;
      top: 0%;
      left: 0px;
      min-height: 100vh;
      max-height: 100%;
      /* min-height: 100vh; */
      overflow-y: auto !important;
      transition: 0.5s all;
      .toggle-menu {
        font-size: 20px;
        cursor: pointer;
      }
      .minimize {
        font-size: 20px;
        margin-right: 15px;
        cursor: pointer;
        &:hover {
          color: #3b7ddd;
        }
      }
    }

    &.actives {
      .sidebarMenu {
        /* width: 260px; */

        transform: translateX(0%);
      }
      .sidebarContent {
        padding-left: 260px;

        /* padding-left: 260px; */
      }
      .footer-content {
        padding-left: 260px;
      }
      @media (max-width: 500px) {
        .sidebarMenu {
          /* width: 260px; */

          transform: translateX(0%);
        }
        .sidebarContent {
          padding-left: 0px;
          left: 260px;
          /* padding-left: 260px; */
        }
      }
    }
  }
`;
export default Header;
