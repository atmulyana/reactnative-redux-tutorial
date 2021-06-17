import { Alert } from "react-native";

export const SERVER_URI = 'http://192.168.56.1:7777/';
export const DEFAULT_REQ_CONF = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
};

export default async function callServer(path, conf = {}) {
    if (typeof conf == 'string') conf = {method: conf};
    if (conf.body && typeof(conf.body) != 'string') conf.body = JSON.stringify(conf.body);
    let uri = SERVER_URI + path;
    conf = Object.assign({}, DEFAULT_REQ_CONF, conf);
    return fetch(uri, conf)
        .then(response => {
            if (!response.ok) {
                console.log('request: ', uri, conf);
                console.log('Not OK, response status: ' + response.status);
                return false;
            }
            return response.json();
        })
        .catch(err => {
            console.log('request: ', uri, conf);
            console.log(err);
            return false;
        })
        .then(data => {
            if (data === false) {
                Alert.alert('Server Error', 'No connection or the server failed to process!');
            }
            return data;
        });
}