import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
    reducerPath: "shoppingCartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7189/api/",
        prepareHeaders: (headers:Headers, api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization", "Bearer " + token)
        },
    }),
    tagTypes: ["ShoppingCarts"],
    endpoints: (builder) => ({
        getShoppingCart: builder.query({
            query: (userId) => ({
                url: "shoppingcart",
                params: {
                    userId:userId
                },
            }),
            providesTags: ["ShoppingCarts"]
        }),
        updateShoppingCart: builder.mutation({
            query: ({menuItemId, updateQty, userId}) => ({
                url: "shoppingCart",
                method:"Post",
                params:{
                    userId,
                    menuItemId,
                    updateQty,
                },
            }),
            invalidatesTags: ["ShoppingCarts"]
        })
    }),
});

export const { useGetShoppingCartQuery, useUpdateShoppingCartMutation } = shoppingCartApi;
export default shoppingCartApi;