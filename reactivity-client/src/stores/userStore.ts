import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../app/models/user";
import axios from "../api/agent";
import { store } from "./store";
import { toast } from "react-toastify";
import { router } from "../app/router/routes";
import agent from "../api/agent";
import modalContainer from "../app/common/modals/modalContainer";

export default class UserStore{
    user:User | null = null;
    constructor() {
       makeAutoObservable(this);
    }


    get isUserLoggedIn(){
        return !!this.user;
    }

    login = async (user:UserFormValues)=>{
        try{
            await axios.Account.login(user).then(x => {
                if(x != null){
                    runInAction(()=>{
                        this.user = x;
                   })
                    store.commonStore.setToken(this.user?.token!);
                    router.navigate('/activities');
                    store.modalStore.closeModal();
                }else {
                    toast.error("user not stored");
                    router.navigate('/');
                }
                
            });
        }catch(error){
            throw error;
        }
    }

    logout = ()=>{
        if(!this.isUserLoggedIn) return
        localStorage.removeItem('jwt');
        runInAction(()=>{
            this.user= null;
        })
        
        router.navigate('/');
    }


    register =async (user:UserFormValues)=>{
            try{
                await agent.Account.register(user).then(user =>{
                    if(user){
                        runInAction(()=>{
                            this.user= user;
                    });
                    store.commonStore.setToken(this.user?.token!);
                    store.modalStore.closeModal();
                    router.navigate('activities');
                    
                    }
                })
            }catch(error){
               
                throw error;
                
            }
    }

    getUser = async ()=>{
        try{
            await agent.Account.currentUser().then(user =>{
               runInAction(()=>{
                this.user = user;
               })
            });
            return this.user;
        }catch(error){
            toast.error("not able to send user from userStore");
            router.navigate('/');
        }
    }
}