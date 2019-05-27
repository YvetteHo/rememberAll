import {rememberAllRealm} from "../database/schemas";
import {AsyncStorage} from "react-native";

const baseURL = 'http://127.0.0.1:8000/';
// const baseURL = 'http://10.0.2.2:8000/';

export const postData = (url, data, header, type) => new Promise( (resolve) => {
    AsyncStorage.getItem('token').then((response) => {
        if (!header) {
            header = {
                'content-type': 'application/json'
            };
            data = JSON.stringify(data)
            console.log(header);
        }
        console.log(type);
        // if (type !== 'users') {
        //     header['Authorization'] = 'Token ' + response;
        // }
        console.log(header);

        fetch(baseURL + url, {
            body: data, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: header,
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }).then((response) => {
            resolve(response)
        })
    });

});
// export const postData = (url, data, header) => {
//     console.log(url, data, header);
//     if (!header) {
//         header = {
//             'content-type': 'application/json'
//         };
//         data = JSON.stringify(data)
//     }
//     AsyncStorage.getItem('token').then((response) => {
//         if (response) {
//             header['Authorization'] = 'Token ' + response
//         }
//     });
//     return fetch(baseURL + url, {
//         body: data, // must match 'Content-Type' header
//         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//         credentials: 'same-origin', // include, same-origin, *omit
//         headers: header,
//         method: 'POST', // *GET, POST, PUT, DELETE, etc.
//         mode: 'cors', // no-cors, cors, *same-origin
//         redirect: 'follow', // manual, *follow, error
//         referrer: 'no-referrer', // *client, no-referrer
//     })
// };

export const putData = (url, data) => new Promise((resolve, reject) => {
    fetch(baseURL + url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {'content-type': 'application/json'},
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    }).then((response) => {
        resolve(response)
    })
});

export const deleteData = (url) => new Promise(resolve => {
    // Default options are marked with *
    fetch(baseURL + url, {
        // body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        // headers: {'content-type': 'application/json'},
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    }).then((response) => {
        resolve(response)
    })
});

export const getData = (url, header) => new Promise( (resolve) => {
    AsyncStorage.getItem('token').then((response) => {
        console.log('token', response);
        header['Authorization'] = 'Token ' + response;
        fetch(baseURL + url, {
            method: 'GET',
            headers: header
        }).then((response)=> resolve(response))
    });

});

