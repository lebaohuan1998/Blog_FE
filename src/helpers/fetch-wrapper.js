import { useAuthStore } from '@/stores';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        return fetch(url, requestOptions).then(handleResponse).catch(error =>{
            if(String(error).indexOf("Failed to fetch") != -1){
                return Promise.reject("Can not connect to server!");
            }else{
                return Promise.reject(error);
            }
        });
        
    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.data?.token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.data.token}` };
    } else {
        return {};
    }
}

async function handleResponse(response) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;


    if(data.status == 200 && data.data =="Login_False"){
        return Promise.reject("Username or password is incorrect!");
    }else if(data.status == 401 && data.data =="Unauthorized"){
        return Promise.reject("unauthorized!");
    }

    // // check for error response
    // if (!response.ok) {
    //     const { user, logout } = useAuthStore();
    //     if ([401, 403].includes(response.status) && user) {
    //         // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
    //         logout();
    //     }

    //     // get error message from body or default to response status
    //     const error = (data && data.message) || response.status;
    //     return Promise.reject(error);
    // }

    return data;
}
