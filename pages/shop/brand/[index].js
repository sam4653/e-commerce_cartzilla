import { useRouter } from "next/router";
import Category from "../../../component/Category";

const ShopBrand = () => {
  const router = useRouter();
  const brandName = router.asPath.split("/").pop();
  return <Category brandName={brandName} />;
};

export default ShopBrand;
