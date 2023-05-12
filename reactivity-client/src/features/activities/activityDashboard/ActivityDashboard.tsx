import React, { useEffect, useState } from "react";
import { Grid, GridColumn, List } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetail from "../activityDetails/ActivityDetail";
import ActivityForms from "../Forms/ActivityForms";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilter from "./activityFilter";


export default observer(function ActivityDashboard() {
  const {activityStore} = useStore();
  const {selectedActivity,editMode} = activityStore;
  
  useEffect(()  => {
    activityStore.loadingActivity();
    }, [activityStore])
    
    
if(activityStore.loadingInitial)return <LoadingComponent content="Loading app"/>
  return (
    <>
      <Grid>
        <GridColumn width="10">
          <ActivityList/>
        </GridColumn>
        <GridColumn width={6}>
          <ActivityFilter/>
        </GridColumn>
      </Grid>
    </>
  );
})
