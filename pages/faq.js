/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Breadcrumb from "../component/Breadcrumb";
import styles from "../styles/Rutvik.module.css";
const faq = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(async () => {
    try {
      await axios
        .get(`${process.env.HOST}/faqs`)
        .then((res) => {
          // console.log(res.data.data[0].id);
          setFaqs(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>

      <Head>
        <title>Vaistra Ecommerce |  Faqs</title>
      </Head>
      <div className= "bg-dark py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-2 mb-3 mb-lg-0 pt-lg-2">
            <Breadcrumb />
          </div>
          <div className="order-lg-1 pr-lg-4 text-center text-lg-left ">
            <h1 className="h3 mb-0 text-dark">FAQ</h1>
          </div>
        </div>
      </div>
      {/* page content */}
      {/* <section className="pt-2 container">
        <div className="pt-3 pb-3">
          <h1 className="faq_heading">How we can help you ?</h1>
        </div>
        <div style={{ height: "70vh", overflowY: "scroll", scrollBehavior: "smooth" }}>
          {faqs.map((faqs, index) => {
            return (
              <>
                <div className="faq" key={index}>
                  <input id={`faq-${index}`} type="checkbox" />
                  <label htmlFor={`faq-${index}`}>
                    <p className="faq-heading">{faqs.question}</p>
                    <div className="faq-arrow"></div>
                    <p className="faq-text">{faqs.answer}</p>
                  </label>
                </div>
              </>
            );
          })}
        </div>
      </section> */}
      <section className="pt-2 container">

        <div className="pt-3 pb-3">
          <h1 className="text-center">How we can help you ?</h1>
        </div>
          <div id="accordion" className="panel-group">
            {faqs.map((faqs, index) => {
              return (
                <>
                  <div className="panel">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        <a href={`#panelBody${index}`} className="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion">{faqs.question}</a>
                      </h4>
                    </div>
                    <div id={`panelBody${index}`} className="panel-collapse collapse ">
                      <div className="panel-body">
                        <p>{faqs.answer}</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
      </section>
    </>
  );
};

export default faq;
