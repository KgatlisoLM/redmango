import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7189/api/"
    }),
    endpoints: (builder) => ({

        registerUser: builder.mutation({
            query: (userData) => ({
                url: "auth/register",
                method:"Post",
                headers:{
                    "Content-type" : "application/json",
                },
                body: userData
            }),
        }),

        LoginUser: builder.mutation({
            query: (userCredentials) => ({
                url: "auth/login",
                method:"Post",
                headers:{
                    "Content-type" : "application/json",
                },
                body: userCredentials
            }),
        }),

    }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
export default authApi;