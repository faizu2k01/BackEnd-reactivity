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
    loadingInitial:boolean=true;

    constructor(){
       makeAutoObservable(this);
    }

    get activitySortedByDate():Array<Activity>{
        return Array.from(this.activitiesRegistry.values()).sort((b,a)=>Date.parse(b.date)-Date.parse(a.date));
    }
    //action of the mobx
    loadingActivity = async ()=>{
        try{
            const activities  = await agent.Activities.list();
             activities.forEach(x => {
               x.date =  x.date.split('T')[0]
                this.activitiesRegistry.set(x.id,x);                              
             });
             runInAction(()=>{
                this.loadingInitial = false;
             })
             
             
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loadingInitial = false;

            })
            
        }
    }

    setLoadingInitial = (state:boolean)=>{
        this.loadingInitial = state;
    }

    setSelectedActivity = (id:string)=>{
        this.selectedActivity = this.activitiesRegistry.get(id);
    }
    
    cancelSelectedActivity =()=>{
        this.selectedActivity = undefined;
    }

    openForm = (id?:string)=>{
        id ? this.setSelectedActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
        
    }

    cancelForm = ()=>{
        this.editMode = false;
    }

    createActivity = async (activity:Activity)=>{
        this.loading = true;
        try{
            activity.id = uuid();
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
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
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


