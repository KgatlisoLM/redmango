import React from "react";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/Redux/store";
import { useGetAllOrdersQuery } from "../../apis/orderApi";
import OrderList from "../../Components/Page/Order/OrderList";
import { MainLoader } from "../../Components/Page/Common";

function MyOrders() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetAllOrdersQuery(userId);
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

export default withAuth(MyOrders);
