import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const GAMES_URL = "/api/games";

const initialState = {
    selectedGame: {},
};

const extendedGameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setSelectedGame: (state, action) => {
            state.selectedGame = action.payload;
        },
        clearSelectedGame: (state) => {
            state.selectedGame = null;
        },
    }
})

const gameApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getGames: builder.query({
            query: () => ({
                url: `${GAMES_URL}/getAllGames`,
                method: "GET",
            }),
        }),
    }),

});

export const { useGetGamesQuery } = gameApiSlice;
export const { setSelectedGame, clearSelectedGame } = extendedGameSlice.actions;
export default extendedGameSlice.reducer;

