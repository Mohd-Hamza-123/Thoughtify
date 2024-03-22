import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    queries: []
}

const queriesSlice = createSlice({
    name: 'queriesSlice',
    initialState,
    reducers: {
        getQueriesInRedux: (state, action) => {
            // console.log(action.payload.queries)
            state.queries = action.payload.queries
        }
    }

})

export const { getQueriesInRedux} = queriesSlice.actions;
export default queriesSlice.reducer