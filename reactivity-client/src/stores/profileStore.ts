import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../app/models/profile";
import agent from "../api/agent";
import { store } from "./store";
import axios from "axios";

export default class ProfileStore{
    profiles:Profile|null=null;
    loadingProfile:boolean=false;
    uplaodingImg:boolean=false;
    loadingsetMain:boolean=false;

    constructor(){
        makeAutoObservable(this);
    }

    get userCheck(){
        if(store.userStore.user && this.profiles){
            return store.userStore.user.userName === this.profiles.userName;
        }

        return false;
    }

    loadingProf = async (username:string)=>{
        this.loadingProfile = false;
        try{
            const result = await agent.Profiles.get(username);
            runInAction(()=>{
                this.profiles = result;
                this.loadingProfile = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loadingProfile=false;
            })
        }
    }

    uploadImg = async (file:Blob)=>{
        this.uplaodingImg = true;
        try{
            const resp = await agent.Profiles.uplaodPhotos(file);
            const photo = resp.data;
            runInAction(()=>{
                if(this.profiles){
                    this.profiles.photos?.push(photo);
                    
                    if(photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profiles.image = photo.url;
                    }

                    
                }
                this.uplaodingImg=false;
            })

        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.uplaodingImg=false;
            })
        }
    }

    setMainImage= async (photo:Photo)=>{
        this.loadingsetMain = true;
        try{
            await agent.Profiles.setMainImg(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(()=>{
                if(this.profiles && this.profiles.photos){
                    this.profiles.photos.find(x => x.isMain)!.isMain = false;
                    this.profiles.photos.find(y=> y.id === photo.id)!.isMain = true;
                    this.profiles.image= photo.url;
                    
                }
                this.loadingsetMain = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loadingsetMain=false;
            })
        }

    }

    deleteImageNotMain=async(photo:Photo)=>{
        this.loadingsetMain = true;
        try{

            await agent.Profiles.deleteImg(photo.id);
            runInAction(()=>{
              this.profiles!.photos = this.profiles?.photos?.filter(x => x.id !== photo.id);
              this.loadingsetMain = false;  
            })

        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loadingsetMain = false;
            })
        }
    }
}