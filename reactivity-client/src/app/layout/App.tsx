import React, { Fragment, useEffect, useState } from "react";
import "./styles.css";
import {  Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import { v4 as uuid} from 'uuid';
import ActivityDashboard from "../../features/activities/activityDashboard/ActivityDashboard";
import agent from "../../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity,setSelectedActity] = useState<Activity | undefined>( undefined);
  const [editMode,setEditMode] = useState(false);
  const [loading,setLoading] = useState(true);
  const [submitting,setSubmitting]=useState(false);

  useEffect(() => {
    agent.Activities.list().then(res =>{
      res.forEach(x => {
        x.date = x.date.split('T')[0];
      })

      setActivities(res);
      setLoading(false);
    }); 
      
    }, []);

 function handleSelectActivity(id:string){
    setSelectedActity(activities.find(x => x.id === id));
  }

 function handleCancelActivity(){
    setSelectedActity(undefined);
  }


function openForm(id?:string){
  id ? handleSelectActivity(id) : handleCancelActivity();
  setEditMode(true);
}

function closeForm(){
  setEditMode(false);
}

function handleCreateOrEditActivity(activity:Activity){

  setSubmitting(true);
  if(activity.id){
    agent.Activities.update(activity).then(()=>{
      setActivities([...activities.filter(x=> x.id !== activity.id),activity]);
      setSelectedActity(activity);
      setEditMode(false);
      setSubmitting(false);
    })
  }else{
    activity.id = uuid();
    agent.Activities.create(activity).then(()=>{
      setActivities([...activities,activity]);
      setSelectedActity(activity);
      setEditMode(false);
      setSubmitting(false);
    })
  }
  
}

function handleDeleteActivity(id:string){
  setSubmitting(true);
  agent.Activities.del(id).then(()=>{
    setActivities(activities.filter(x=> x.id !== id));
    setSubmitting(false);
  })
  
}


if(loading) return <LoadingComponent content="Loading app"/>

  return (
    
      <Fragment>
        <NavBar editMode={editMode} openForm={openForm}/>
        <Container style={{marginTop:'7em'}}>
          <ActivityDashboard activities={activities}
           selectedActivity = {selectedActivity}
           handleSelectActivity={handleSelectActivity}
           cancelSelectedActivity = {handleCancelActivity}
           editMode={editMode}
           openForm={openForm}
           closeForm={closeForm}
           handlerCreateOrEditActivity={handleCreateOrEditActivity}
           deleteActivity={handleDeleteActivity}
           submitting={submitting}
          />
        </Container>
      </Fragment>
    
  );
}

export default App;
