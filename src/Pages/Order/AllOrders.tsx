import React from "react";
import { withAdminAuth, withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { useGetAllOrdersQuery } from "../../apis/orderApi";
import OrderList from "../../Components/Page/Order/OrderList";
import { MainLoader } from "../../Components/Page/Common";

function AllOrders() {
  const { data, isLoading } = useGetAllOrdersQuery("");
  console.log(data);

  return (
    <>
      {isLoading ? <MainLoader /> : null}
      {!isLoading ? (
        <OrderList isLoading={isLoading} orderData={data.result} />
      ) : null}
    </>
  );
}

export default withAdminAuth(AllOrders);
