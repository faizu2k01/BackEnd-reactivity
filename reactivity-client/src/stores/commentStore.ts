import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComments } from "../app/models/ChatComments";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import { error } from "console";

export default class CommentStore{
    comment:ChatComments[]=[];
    hubConnection:HubConnection|null=null;

    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection = (activityId:string)=>{

        if(store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder().withUrl(process.env.REACT_APP_CHAT_URL+`?activityId=${activityId}`,{
                accessTokenFactory:()=>store.userStore.user?.token!
            }).withAutomaticReconnect().configureLogging(LogLevel.Information).build();

            this.hubConnection.start().catch(error=>console.log(error));
            this.hubConnection.on("LoadComments",(comment:ChatComments[])=>{
                runInAction(()=>{
                    comment.map(cmt=>{
                        cmt.createAt = new Date(cmt.createAt);
                    })
                    this.comment = comment;
                });
            });
            this.hubConnection.on("ReceiveComment",(comment:ChatComments)=>{
                runInAction(()=>{
                    comment.createAt = new Date(comment.createAt);
                    this.comment.push(comment);
                })
            })
        }
    }

    stopHubConnection = ()=>{
        this.hubConnection?.stop().catch(error=>console.log(error));
    }

    clearComment = ()=>{
        this.comment = [];
        this.stopHubConnection();
    }

    addComment = async (value:any)=>{
        value.activityId = store.activityStore.selectedActivity?.id;
        try{
            await this.hubConnection?.invoke('SendComment',value);

        }catch(error){
            console.log(error);
        }
    }
}