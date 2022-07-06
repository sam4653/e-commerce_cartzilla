import dynamic from "next/dynamic";
import withAuth from "../../component/withAuth";

const ChangePassword = dynamic(() => import("../../component/ChangePassword"));

const changePassword = () => {
    return <ChangePassword />;
};

export default withAuth(changePassword);
