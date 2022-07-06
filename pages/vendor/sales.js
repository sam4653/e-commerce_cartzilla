import React, { useEffect, useState } from "react";
import withAuth from "../../component/withAuth";
import Head from "next/head";
import { getSession } from "next-auth/client";
import { toast } from "react-toastify";
import axios from "axios";
import useSWR from "swr";
import ReactLoading from "react-loading";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
const apiChartData = [
    { month: "Jan", value: 0 },
    { month: "Fab", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
    { month: "Jul", value: 0 },
    { month: "Aug", value: 0 },
    { month: "Sep", value: 0 },
    { month: "Oct", value: 0 },
    { month: "Nov", value: 0 },
    { month: "Dec", value: 0 },
]
const VenderSales = ({ name, amount, date }) => {
    return (
        <div className="col-md-4 col-sm-6 px-2 mb-4">
            <div className="bg-secondary h-100 rounded-lg p-4 text-center">
                <h3 className="font-size-sm text-muted">{name}</h3>
                <p className="h2 mb-2">
                    ₹ {(+amount).toFixed(2)}
                    {/* <small>{amount.split(".")[1]}</small> */}
                </p>
                <p className="font-size-ms text-muted mb-0">{date}</p>
            </div>
        </div>
    );
};

const total = async (url) => {
    const sess = await getSession();
    const total = await axios
        .get(`${url}total`, {
            headers: {
                Authorization: sess.accessToken,
            },
        })
        .then((res) => res.data.data[0]);
    const lastWeekOrders = await axios
        .get(`${url}last-week`, {
            headers: {
                Authorization: sess.accessToken,
            },
        })
        .then((res) => res.data.totalOrders);
    return { ...total, lastWeekOrders };
};

const url = `${process.env.HOST}/order/`;

const sales = () => {
    const { data, error } = useSWR(url, total);

    if (error) {
        toast.error("😢 " + err.response?.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
        });
    }

    // const [apiChartDate, setApiChartDate] = useState([{ order_month: "" }])
   
    const [dataval, setDataval] = useState("")
    useEffect(async () => {
        const session = await getSession();
        await axios
            .get(`${process.env.HOST}/order/total`, {
                headers: {
                    Authorization: session.accessToken,
                },
            })
            .then((res) => {
                for (const ad of res.data.data[0].orderDetail) {
                    apiChartData[new Date(ad.order_month).getMonth()].value = ad.total
                }
                // console.log("apiDate", res.data.data[0].orderDetail)
            }).catch((error) => {
                console.log(error);
            })
    }, [])

    // console.log("Data", apiChartData)
    // const dateFormatter = date => {
    //     // return moment(date).unix();
    //     return moment(date).format("DD/MM/YY HH:mm");
    //   };

    // apiChartData.forEach(d => {
    //     d.order_month = moment(d.order_month).valueOf(); // date -> epoch
    // });

    //     useEffect(() => {
    //         const valuess = apiChartDate?.map((val) => val.order_month.split("-").slice(1, 2).join("").replace("0", ""))
    //         console.log("valuess",valuess)
    // }, [])


    // if (!data) {
    //     return <p>Loading Data....</p>;
    // }

    return (
        <>
            <Head>
                <title>Vaistra E-commerce | Sales</title>
            </Head>
            <section className="col-lg-8">
                {data ? (
                    <div className="pt-2 px-4 pl-lg-0 pr-xl-5">
                        <h2 className="h3 py-2 text-center text-sm-left">
                            Your sales / earnings
                        </h2>
                        <div className="row mx-n2 pt-2">
                            <VenderSales
                                name="Earnings (before taxes)"
                                // amount={1690.5}
                                amount="00"
                            // date="Sales 8/1/2019 - 8/15/2019"
                            />
                            <VenderSales
                                name="Your balance"
                                // amount={1375.0}
                                amount="00"
                            // date="To be paid on 8/15/2019"
                            />
                            <VenderSales
                                name="Lifetime earnings"
                                // amount={data.totalrevenue}
                                amount="00"
                            // date="Based on list price"
                            />
                            <div className="col-lg-12">
                                <h2 className="h3 py-2 text-center text-sm-left">Sales Chart</h2>
                                {/* <LineChart
                                    width={780}
                                    height={300}
                                    data={chartData}
                                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                >
                                    <Line type="monotone" dataKey="total" stroke="#8884d8" dot={false} />
                                    <XAxis dataKey="order_month" />
                                    <YAxis />
                                </LineChart> */}
                                <BarChart
                                    width={780}
                                    height={300}
                                    data={apiChartData}
                                    margin={{ top: 20, left: -10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    {/* <XAxis dataKey={"order_month"} domain={[apiChartData[0].order_month, apiChartData[apiChartData.length - 1].order_month]}
                                        scale="time" type="number" tickFormatter={DateFormatter} /> */}
                                    <XAxis dataKey={"month"} />
                                    <YAxis yAxisId="left" orientation="left" stroke="#58508d" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#bc5090" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="value" fill="#58508d" />
                                </BarChart>
                            </div>
                            {/* <div className="col-md-4 col-sm-6 px-2 mb-4">
                            <div className="bg-secondary h-100 rounded-lg p-4 text-center">
                                <h3 className="font-size-sm text-muted">
                                    Earnings (before taxes)
                                </h3>
                                <p className="h2 mb-2">
                                    $1,690.<small>50</small>
                                </p>
                                <p className="font-size-ms text-muted mb-0">
                                    Sales 8/1/2019 - 8/15/2019
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-6 px-2 mb-4">
                            <div className="bg-secondary h-100 rounded-lg p-4 text-center">
                                <h3 className="font-size-sm text-muted">
                                    Your balance
                                </h3>
                                <p className="h2 mb-2">
                                    $1,375.<small>00</small>
                                </p>
                                <p className="font-size-ms text-muted mb-0">
                                    To be paid on 8/15/2019
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-12 px-2 mb-4">
                            <div className="bg-secondary h-100 rounded-lg p-4 text-center">
                                <h3 className="font-size-sm text-muted">
                                    Lifetime earnings
                                </h3>
                                <p className="h2 mb-2">
                                    $9,156.<small>74</small>
                                </p>
                                <p className="font-size-ms text-muted mb-0">
                                    Based on list price
                                </p>
                            </div>
                        </div> */}
                        </div>

                    </div>
                ) : (
                    <div className="loadingBars">
                        <ReactLoading type="bars" color="#666362"
                            height={100} width={70} />
                    </div>
                )}

            </section>
        </>
    );
};

export const getServerSideProps = async () => {
    const session = await getSession();
    // console.log("ServerSideProps : ", session);
    return {
        props: {
            session,
        },
    };
};
export default withAuth(sales);
