import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Head from 'next/head';
import Breadcrumb from "../component/Breadcrumb";
import styles from "../styles/Rutvik.module.css";
export default function about() {
  const [aboutApi, setAboutApi] = useState([]);
  useEffect(() => {
    const aboutData = async () => {
      try {
        const res = await axios.get(
          `${process.env.HOST}/aboutUs`
        );
        setAboutApi(res.data.data);
        // console.log("About Api Data shown :", res.data.data)
      } catch (err) {
        console.log(err.response);
      }
    };
    aboutData();
  }, []);
  return (
    <>
      <Head>
        <title>Vaistra Ecommerce | About Us</title>
      </Head>
      {/* <div className={`${styles.bgImg} py-4 `}> */}
      <div className="bg-dark py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
            <Breadcrumb />
          </div>
          <div className="order-lg-1 pr-lg-4 text-center text-lg-left ">
            <h1 className="h3 mb-0 text-dark">About US</h1>
          </div>
        </div>
      </div>

      <main className="container-fluid px-0">


        {aboutApi.map((ad, index) => {
          return (
              <>
              <section className="row no-gutters" key={index}>
                <div className={`col-md-6 bg-position-center bg-size-cover bg-secondary ${index%2==0?  "order-md-2":""}` } style={{ minHeight: "15rem", backgroundImage: `url(${ad.image})` }}></div>
                <div className={`col-md-6 px-3 px-md-5 py-5 ${index%2==0?  "order-md-1":""}`}>
                  <div className="mx-auto py-lg-5" style={{ maxWidth: "35rem" }}>
                    <h2 className="h3 pb-3">{ad.title}</h2>
                    <p className="font-size-sm pb-3 text-muted">{ad.desc}</p>
                    {/* <a className="btn btn-primary btn-shadow" href="shop-grid-ls.html">View products</a> */}
                  </div>
                </div>
              </section>
            </>
          );
        })}
        {/* <section className="row no-gutters">
          <div className="col-md-6 bg-position-center bg-size-cover bg-secondary order-md-2" style={{ minHeight: "15rem", backgroundImage: "url(img/about/02.jpg)" }}></div>
          <div className="col-md-6 px-3 px-md-5 py-5 order-md-1">
            <div className="mx-auto py-lg-5" style={{ maxWidth: "35rem" }}>
              <h2 className="h3 pb-3">Fast delivery worldwide</h2>
              <p className="font-size-sm pb-3 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id purus at risus pellentesque faucibus a quis eros. In eu fermentum leo. Integer ut eros lacus. Proin ut accumsan leo. Morbi vitae est eget dolor consequat aliquam eget quis dolor. Mauris rutrum fermentum erat, at euismod lorem pharetra nec. Duis erat lectus, ultrices euismod sagittis at, pharetra eu nisl. Phasellus id ante at velit tincidunt hendrerit. Aenean dolor dolor tristique nec. Tristique nulla aliquet enim tortor at auctor urna nunc. Sit amet aliquam id diam maecenas ultricies mi eget.</p><a className="btn btn-accent btn-shadow" href="#">Shipping details</a>
            </div>
          </div>
        </section>
        <section className="row no-gutters">
          <div className="col-md-6 bg-position-center bg-size-cover bg-secondary" style={{ minHeight: "15rem", backgroundImage: "url(img/about/03.jpg)" }}></div>
          <div className="col-md-6 px-3 px-md-5 py-5">
            <div className="mx-auto py-lg-5" style={{ maxWidth: "35rem" }}>
              <h2 className="h3 pb-3">Great mobile app. Shop on the go</h2>
              <p className="font-size-sm pb-3 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id purus at risus pellentesque faucibus a quis eros. In eu fermentum leo. Integer ut eros lacus. Proin ut accumsan leo. Morbi vitae est eget dolor consequat aliquam eget quis dolor. Mauris rutrum fermentum erat, at euismod. Duis erat lectus, ultrices euismod sagittis at dolor tristique nec. Tristique nulla aliquet enim tortor at auctor urna nunc. Sit amet aliquam id diam maecenas ultricies mi eget.</p><a className="btn-market btn-apple mr-3 mb-3" href="#" role="button"><span className="btn-market-subtitle">Download on the</span><span className="btn-market-title">App Store</span></a><a className="btn-market btn-google mb-3" href="#" role="button"><span className="btn-market-subtitle">Download on the</span><span className="btn-market-title">Google Play</span></a>
            </div>
          </div>
        </section>
        <section className="row no-gutters">
          <div className="col-md-6 bg-position-center bg-size-cover bg-secondary order-md-2" style={{ minHeight: "15rem", backgroundImage: "url(img/about/04.jpg)" }}></div>
          <div className="col-md-6 px-3 px-md-5 py-5 order-md-1">
            <div className="mx-auto py-lg-5" style={{ maxWidth: "35rem" }}>
              <h2 className="h3 pb-3">Shop offline. Cozy outlet stores</h2>
              <p className="font-size-sm pb-3 text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id purus at risus pellentesque faucibus a quis eros. In eu fermentum leo. Integer ut eros lacus. Proin ut accumsan leo. Morbi vitae est eget dolor consequat aliquam eget quis dolor. Mauris rutrum fermentum erat, at euismod lorem pharetra nec. Duis erat lectus, ultrices euismod sagittis at, pharetra eu nisl. Phasellus id ante at velit tincidunt hendrerit. Aenean dolor dolor tristique nec. Tristique nulla aliquet enim tortor at auctor urna nunc. Sit amet aliquam id diam maecenas ultricies mi eget.</p><a className="btn btn-warning btn-shadow" href="contacts.html">See outlet stores</a>
            </div>
          </div>
        </section> */}
        <hr />
      </main>
    </>
  )
}
