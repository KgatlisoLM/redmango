import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { OrderDetails } from "../Pages";

const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7189/api/",
        prepareHeaders: (headers:Headers, api) => {
          const token = localStorage.getItem("token");
          token && headers.append("Authorization", "Bearer " + token)
        },
    }),
    tagTypes: ["Orders"],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderDetails) => ({
                url: "order",
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body:orderDetails
            }),
            invalidatesTags:["Orders"],
        }),
        getAllOrders: builder.query({
            query: (userId) => ({
                url: "order",
                params: {
                    userId: userId,
                }
            }),
            providesTags: ["Orders"]
        }),
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `order/${id}`
            }),
            providesTags: ["Orders"]
        }),
        updateOrderHeader: builder.mutation({
            query:(OrderDetails) => ({
                url: "order/" + OrderDetails.orderHeaderId,
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: OrderDetails
            }),
            invalidatesTags: ["Orders"]
        }),
    }),
});

export const { 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useGetOrderDetailsQuery, 
    useUpdateOrderHeaderMutation } = orderApi;
export default orderApi;