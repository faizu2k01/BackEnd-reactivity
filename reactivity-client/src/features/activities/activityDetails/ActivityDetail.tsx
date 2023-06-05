import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, Image } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Link, useParams } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import ActivityDetailedHeader from './activityDetailedHeader';
import ActivityDetailedInfo from './activityDetailedInfo';
import ActivityDetailedChat from './activityDetailedChat';
import ActivityDetailedSidebar from './activityDetailedSidebar';



export default observer(function ActivityDetail(){
 const {id} = useParams();
 const {activityStore} = useStore();
 const {loadingActivityDetail,loadingInitial,clearSelectedActivity} = activityStore;
 const [activity,setActivity] = useState<Activity | undefined>(undefined);
 useEffect(()=>{
  if(id && !activity){
    loadingActivityDetail(id).then(activity => setActivity(activity));
  } 
  return ()=>clearSelectedActivity();
 },[id,activity,clearSelectedActivity])

  
  if(loadingInitial || !activity) return <LoadingComponent/>
  return(
    <>
   <Grid>
    <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity}/>
        <ActivityDetailedInfo activity={activity}/>
        <ActivityDetailedChat activityId={activity.id}/>
    </Grid.Column>
    <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={activity}/>
    </Grid.Column>
   </Grid>
    </>
  )
})