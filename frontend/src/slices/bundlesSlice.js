import { apiSlice } from "./apiSlice";

const BUNDLES_URL = "/api/bundles";

const bundleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBundles: builder.query({
            query: () => ({
                url: `${BUNDLES_URL}/getAllBundles`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetBundlesQuery,
} = bundleApiSlice;
