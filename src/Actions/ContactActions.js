export const FETCH_CONTACT_REQUEST = "FETCH_CONTACT_REQUEST";
export const FETCH_CONTACT_SUCCESS = "FETCH_CONTACT_SUCCESS";
export const FETCH_CONTACT_FAILURE = "FETCH_CONTACT_FAILURE";

import { API_ENDPOINT, API_DATA } from "../Config/Client/APIs";
import http from "../Utils/Http";
import axios from 'axios';

export const fetchContactRequest = () => ({
    type: FETCH_CONTACT_REQUEST
});

export const fetchContactSuccess = blog => ({
    type: FETCH_CONTACT_SUCCESS,
    payload: blog
});

export const fetchContactFailure = error => ({
    type: FETCH_CONTACT_FAILURE,
    payload: error
});

export const addNewContact = (contactData) => {
    return dispatch => {
        dispatch(fetchContactRequest());
        http.post(`${API_ENDPOINT}${API_DATA.contact}`, contactData)
            .then(response => {
                dispatch(fetchContactSuccess(response.data));
            })
            .catch(error => {
                const errorMsg = error.message;
                dispatch(fetchContactFailure(errorMsg));
            });
    };
};