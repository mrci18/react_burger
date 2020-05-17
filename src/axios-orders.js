import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://reactburger-f287b.firebaseio.com/'
});

export default instance;