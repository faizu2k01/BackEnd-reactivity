import { makeAutoObservable, makeObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../app/models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";
import {format} from 'date-fns';
import { store } from "./store";
import { transpileModule } from "typescript";
import { toast } from "react-toastify";
import { Profile } from "../app/models/profile";

export default class ActivityStore{
    activitiesRegistry = new Map<string,Activity>();
    selectedActivity:Activity|undefined = undefined;
    editMode:boolean=false;
    loading:boolean=false;
    submitting:boolean=false;
    loadingInitial:boolean=false;

    constructor(){
       makeAutoObservable(this);
    }

    get activitySortedByDate():Array<Activity>{
        return Array.from(this.activitiesRegistry.values()).sort((b,a)=>b.date!.getTime()-a.date!.getTime());
    }

    get groupedActivities(){
        return Object.entries(
            this.activitySortedByDate.reduce((activites,activity) => {
                const date = format(activity.date!,'dd MMM yyyy');
                activites[date!] = activites[date!] ? [...activites[date!],activity] : [activity];
                return activites
            },{} as {[Key:string]:Activity[]})
        )
    }

    //action of the mobx
    loadingActivity = async ()=>{
       this.setLoadingInitial(true);
       if(!this.activitiesRegistry || this.activitiesRegistry.size > 0){
        this.setLoadingInitial(false); 
        return;
       } 
        try{
            const activities  = await agent.Activities.list();
             activities.forEach(x => {
             x =  this.setActivityDate(x);    
             this.activitiesRegistry.set(x.id,x);                      
             });
             runInAction(()=>{
                this.setLoadingInitial(false);
             })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.setLoadingInitial(false);

            }) 
        }
    }


    loadingActivityDetail=async(id:string)=>{
        this.setLoadingInitial(true);
        var activity = this.getActivityFormMemory(id);
        if(activity){
            runInAction(()=>{
                this.selectedActivity = activity;
                this.setLoadingInitial(false);
            })
             return activity;
        } 
        else{
            try{
                this.setLoadingInitial(true);
                 activity =  await agent.Activities.details(id);
                runInAction(()=>{
                    this.selectedActivity = this.setActivityDate(activity!);
                    this.setLoadingInitial(false);
                })       
                
                return activity;
               
            }catch(error){
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    setLoadingInitial = (state:boolean)=>{
        this.loadingInitial = state;
    }

    setSelectedActivity = (id:string)=>{
        this.selectedActivity = this.activitiesRegistry.get(id);
    }

    private setActivityDate(x:Activity){
        var user = store.userStore.user;
        if(user){
            x.isGoing = x.attendees?.some( a => a.userName === user?.userName);
            x.isHost = x.hostUserName === user.userName;
            x.host = x.attendees?.find(y=> y.userName === x.hostUserName);
        }
        x.date =  new Date(x.date!);
        return x;  
    }

    private getActivityFormMemory(id: string){
        return this.activitiesRegistry.get(id);
    }
   

    createActivity = async (activity:ActivityFormValues)=>{
       const user = store.userStore.user;
       const attendee = new Profile(user!);
        try{
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee];
            await agent.Activities.create(activity);
            this.setActivityDate(newActivity);
            runInAction(()=>{
                this.activitiesRegistry.set(activity.id!, newActivity as unknown as Activity);
                this.selectedActivity = newActivity;
            })  
        }catch(error){
            console.log(error); 
        }
    }


    updateActivity = async (activiy:ActivityFormValues)=>{
        try{
            await agent.Activities.update(activiy);
        runInAction(()=>{
            if(activiy.id){
                const updatedActivity = {...this.getActivityFormMemory(activiy.id),...activiy};
                this.activitiesRegistry.set(activiy.id, updatedActivity as unknown as Activity);
                this.selectedActivity = updatedActivity as unknown as Activity;
            }
        })  
        }catch(error){
            console.log(error);
            
        }
    }

    deleteActivity = async (id:string) =>{
        this.loading = true;
        try{
            await agent.Activities.del(id);
            runInAction(()=>{
                this.activitiesRegistry.delete(id);
                this.selectedActivity = undefined;
                this.editMode = false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.editMode =false;
                this.loading = false;
            })
        }
    }

    updateAttendee = async ()=>{
        const user = store.userStore.user;
        this.loading = true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(z => z.userName !== user?.userName);
                    this.selectedActivity.isGoing= false;
                }
                else{
                    const attendence = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendence);
                    this.selectedActivity!.isGoing=true;
                }

                this.activitiesRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
                })

        }catch(error){
            toast.error(error);
        }finally{
            runInAction(()=>{
                this.loading=false;
            })
        }
    }

    cancelActivityToggle = async ()=>{
        this.loading = true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
            this.activitiesRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
            this.loading=false;
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            })
        }
        finally{
            runInAction(()=>{
                this.loading=false;
            })
        }
    }

    clearSelectedActivity = ()=>{
        this.selectedActivity =undefined;
    }
}


