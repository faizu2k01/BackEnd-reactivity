import axios, { AxiosResponse } from "axios";
import { Activity } from "../app/models/activity";


const sleep = (delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay);
    })
}

axios.interceptors.response.use(async resp =>{
    try{
        await sleep(2000);
        return resp;
    }catch(error){
    console.log(error);
    return await Promise.reject(error);
    }
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

