import { makeAutoObservable, makeObservable, runInAction } from "mobx";
import { Activity } from "../app/models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";

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
        return Array.from(this.activitiesRegistry.values()).sort((b,a)=>Date.parse(b.date)-Date.parse(a.date));
    }

    get groupedActivities(){
        return Object.entries(
            this.activitySortedByDate.reduce((activites,activity) => {
                const date = activity.date;
                activites[date] = activites[date] ? [...activites[date],activity] : [activity];
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
        x.date =  x.date.split('T')[0];
        return x;  
    }

    private getActivityFormMemory(id: string){
        return this.activitiesRegistry.get(id);
    }
   

    createActivity = async (activity:Activity)=>{
        this.loading = true;
        try{
            //activity.id = uuid();
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activitiesRegistry.set(activity.id,activity);
                this.editMode = false;
                this.loading = false;
            })  
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.editMode = false;
                this.loading = false;
            })  
        }
    }


    updateActivity = async (activiy:Activity)=>{
        this.loading = true;
        try{
            await agent.Activities.update(activiy);
       
        runInAction(()=>{
            this.activitiesRegistry.set(activiy.id,activiy);
            this.selectedActivity = activiy;
            this.editMode = false;
            this.loading = false;
        })  
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.editMode = false;
                this.loading = false;
            })  
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
}


