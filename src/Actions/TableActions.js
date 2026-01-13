import axios from "axios";

export const FETCH_TABLE_REQUEST = 'FETCH_TABLE_REQUEST';
export const FETCH_TABLE_SUCCESS = 'FETCH_TABLE_SUCCESS';
export const FETCH_TABLE_FAILURE = 'FETCH_TABLE_FAILURE';

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";


export const fetchTableRequest = () => ({
    type: FETCH_TABLE_REQUEST
});

export const fetchTableSuccess = table => ({
    type: FETCH_TABLE_SUCCESS,
    payload: table
});

export const fetchTableFailure = error => ({
    type: FETCH_TABLE_FAILURE,
    payload: error
});



export const fetchTable = () => {
    return dispatch => {
        dispatch(fetchTableRequest());
        return axios.get(`${API_ENDPOINT}${API_DATA.table}`) 
            .then(response => {
                const tables = response.data.results;
                dispatch(fetchTableSuccess(tables));
                return tables;
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchTableFailure(errorMsg));
            });
    };
};


