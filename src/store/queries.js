import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    queries: [],
    flag: false
}

const queriesSlice = createSlice({
    name: 'queriesSlice',
    initialState,
    reducers: {
        getQueriesInRedux: (state, action) => {
            let array = []
            if (action.payload.flag === true) {
                array = [...action.payload.queries]
            } else {
                array = [...state.queries, ...action.payload.queries]
            }
            let uniqueArray = Array.from(new Map(array.map(obj => [obj.$id, obj])).values());
            state.queries = [...uniqueArray]
        }
    }

})

export const { getQueriesInRedux } = queriesSlice.actions;
export default queriesSlice.reducer