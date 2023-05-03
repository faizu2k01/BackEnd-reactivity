import React, { useState } from "react";
import { Grid, GridColumn, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "../ActivityList";
import ActivityDetail from "../activityDetails/ActivityDetail";
import ActivityForms from "../Forms/ActivityForms";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";


export default observer(function ActivityDashboard() {

  const {activityStore} = useStore();
  const {selectedActivity,editMode} = activityStore;
  return (
    <>
      <Grid>
        <GridColumn width="10">
          <ActivityList/>
        </GridColumn>
        <GridColumn width="6" style={{ overflow: "hidden" }}>
          {selectedActivity && !editMode  && (
            <ActivityDetail/>
          )}
          {editMode && <ActivityForms /> }
          
        </GridColumn>
      </Grid>
    </>
  );
})
