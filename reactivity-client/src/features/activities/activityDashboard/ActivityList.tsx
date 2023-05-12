import React, { Fragment, SyntheticEvent, useState } from "react";
import { Button, Header, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import ActivityListItem from "./activityListItem";


export default observer(function ActivityList() {
  const {activityStore} = useStore();
  const {setSelectedActivity:handleSelectActivity,groupedActivities}=activityStore;
  const [target,setTarget]=useState('');

  
  return (
    <>
    {
      groupedActivities.map(([date,activities])=>{
        return <Fragment key={date}>
            <Header sub color='teal'>
              {date}
            </Header>
          {activities.map(activity => {
            return <ActivityListItem key={activity.id} activity={activity}/>
          })}
        </Fragment>
      })
    }

     
    </>
  );
})
