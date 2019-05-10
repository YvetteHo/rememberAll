

export const postData = (url, data, header) => {
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

export const getData = (url, header) => {

    return fetch(url, {
        method: 'GET',
        headers: header
    })
};

