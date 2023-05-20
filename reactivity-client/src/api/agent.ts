import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../app/models/activity";
import { toast } from "react-toastify";
import { router } from "../app/router/routes";
import { store } from "../stores/store";


const sleep = (delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay);
    })
}

axios.interceptors.response.use(async resp =>{
        await sleep(2000);
        return resp;
 },(error:AxiosError)=>{
    
    const {data,status,config} = error.response as AxiosResponse;

    switch (status){
        case 404:
            router.navigate('/not-found');
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
    create:(activity:Activity)=>requests.post<void>('/activities', activity),
    update:(activity:Activity)=>requests.put<void>(`/activities/${activity.id}`,activity),
    del:(id:string)=>requests.delete<void>(`/activities/${id}`)
}

const agent ={
    Activities
}


export default agent;


