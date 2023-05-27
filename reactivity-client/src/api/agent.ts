import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../app/models/activity";
import { toast } from "react-toastify";
import { router } from "../app/router/routes";
import { store } from "../stores/store";
import { User, UserFormValues } from "../app/models/user";
import { configure } from "mobx";


const sleep = (delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay);
    })
}

axios.interceptors.request.use(configure=>{
    const token = store.commonStore.token;
    if(token && configure.headers) configure.headers.Authorization = `Bearer ${token}`;
    return configure; 
})
axios.interceptors.response.use(async resp =>{
        await sleep(2000);
        return resp;
 },(error:AxiosError)=>{
    
    const {data,status,config} = error.response as AxiosResponse;

    switch (status){
        case 404:
            router.navigate('/not-found');
            break;
        case 401:
            toast.error("Unothorizes");
            break;
        case 400:
            if(config.method==='get' && data.errors.hasOwnProperty('id')){
                router.navigate('/not-found');
            }
            if(data.errors){
                const modelStateErrors=[];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                throw modelStateErrors.flat();
            }else{
                toast.error("Bad Request");
            }
            
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }

    return  Promise.reject(error);
 } )

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response:AxiosResponse<T>) => response.data;

const requests = {
    get:<T> (url:string) => axios.get<T>(url).then(responseBody),
    post:<T> (url:string,body:{}) => axios.post<T>(url,body).then(responseBody),
    put:<T> (url:string,body:{}) => axios.put<T>(url,body).then(responseBody),
    delete:<T> (url:string)=> axios.delete<T>(url).then(responseBody)
}

const Activities ={
    list:()=> requests.get<Activity[]>('/activities'),
    details:(id:string)=> requests.get<Activity>(`/activities/${id}`),
    create:(activity:ActivityFormValues)=>requests.post<void>('/activities', activity),
    update:(activity:ActivityFormValues)=>requests.put<void>(`/activities/${activity.id}`,activity),
    del:(id:string)=>requests.delete<void>(`/activities/${id}`),
    attend:(id:string)=> requests.post<void>(`/activities/${id}/attend`,{})
}

const Account ={
    currentUser:()=> requests.get<User>('/account'),
    register:(user:UserFormValues) => requests.post<User>("/account/register",user),
    login:(user:UserFormValues)=> requests.post<User>("/account/login",user)
}

const agent ={
    Activities,
    Account
}


export default agent;


