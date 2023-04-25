import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const menuItemApi = createApi({
    reducerPath: "menuItemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7189/api/",
        prepareHeaders: (headers:Headers, api) => {
            const token = localStorage.getItem("token");
            token && headers.append("Authorization", "Bearer " + token)
        },
    }),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({
        getMenuItems: builder.query({
            query: () => ({
                url: "menuItems"
            }),
            providesTags: ["MenuItems"]
        }),
        getMenuItemById: builder.query({
            query: (id) => ({
                url: `menuItems/${id}`
            }),
            providesTags: ["MenuItems"]
        }),
        createMenuItem: builder.mutation({
            query:(data) => ({
                url: "menuitems",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["MenuItems"]
        }),
        updateMenuItem: builder.mutation({
            query:({data,id}) => ({
                url: "menuitems/" + id,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["MenuItems"]
        }),
        deleteMenuItem: builder.mutation({
            query:(id) => ({
                url: "menuitems/" + id,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItems"]
        }),
    }),
});

export const { 
    useGetMenuItemsQuery, 
    useGetMenuItemByIdQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation 
} = menuItemApi;

export default menuItemApi;