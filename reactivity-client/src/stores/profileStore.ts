import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../app/models/profile";
import agent from "../api/agent";
import { store } from "./store";
import axios from "axios";

export default class ProfileStore{
    profiles:Profile|null=null;
    loadingProfile:boolean=false;
    uplaodingImg:boolean=false;
    loadingsetMain:boolean=false;
    following:Profile[]=[];
    loadingFollowing:boolean=false;
    activeTab:any=0;

    constructor(){
        makeAutoObservable(this);
        reaction(()=>this.activeTab,actionTab=>{
            if(actionTab===3||actionTab===4){
                const predicate = actionTab === 3?'followers':'following';
                this.loadFollowing(predicate);
            }else{
                this.following =[];
            }
        })
    }


    setActiveTab = (activeTab:any)=>{
        this.activeTab = activeTab;
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

    updateFollowing = async (username:string,following:boolean)=>{
        this.loadingProfile=true;
        try{
            await agent.Profiles.updateFollow(username);
            store.activityStore.updateFollow(username);
            runInAction(()=>{
                if(this.profiles && this.profiles.userName !== store.userStore.user?.userName && this.profiles.userName === username){
                    following?this.profiles.followerCount++:this.profiles.followerCount--;
                    this.profiles.follow = !this.profiles.follow;
                }
                if(this.profiles && this.profiles.userName !== store.userStore.user?.userName){
                    following?this.profiles.followingCount++:this.profiles.followingCount--;
                }

                this.following.forEach(profile=>{
                    if(profile.userName === username){
                        profile.follow ? profile.followerCount--:profile.followerCount++;
                        profile.follow = !profile.follow;
                    }
                })
                this.loadingProfile=false;
            })

        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loadingProfile=false;
            })
        }
    }


    loadFollowing= async (predicate:string)=>{
        this.loadingFollowing=true;
        try{
            const following = await agent.Profiles.list(this.profiles!.userName,predicate);
            runInAction(()=>{
                this.following = following;
                this.loadingFollowing = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loadingFollowing=false;
            })
        }
    }
}