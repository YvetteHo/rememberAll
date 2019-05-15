import {rememberAllRealm} from "../database/schemas";
import {AsyncStorage} from "react-native";


export const postData = (url, data, header) => {
    console.log(url, data, header);
    if (!header) {
        header = {
            'content-type': 'application/json'
        };
        data = JSON.stringify(data)
    }
    // Default options are marked with *
    return fetch(url, {
        body: data, // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: header,
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
};

export const putData = (url, data) => {
    // Default options are marked with *
    return fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {'content-type': 'application/json'},
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
};

export const deleteData = (url) => {
    // Default options are marked with *
    return fetch(url, {
        // body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        // headers: {'content-type': 'application/json'},
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
};

export const getData = (url, header) => {

    return fetch(url, {
        method: 'GET',
        headers: header
    })
};

export const upload = () => new Promise((resolve, reject) => {
    AsyncStorage.getItem('operations').then((response) => {
        let operations = JSON.parse(response);
        operations.forEach((element) => {

        })
    })
});

