import React, { useState } from "react";
import { Grid, GridColumn, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "../ActivityList";
import ActivityDetail from "../activityDetails/ActivityDetail";
import ActivityForms from "../Forms/ActivityForms";

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  editMode:boolean;
  openForm:(id:string)=> void;
  closeForm:()=> void;
  handleSelectActivity: (id: string) => void;
  cancelSelectedActivity: () => void;
  handlerCreateOrEditActivity:(activity:Activity) => void;
  deleteActivity:(id:string)=> void;
  submitting:boolean;

}
export default function ActivityDashboard({
  activities,
  handleSelectActivity,
  cancelSelectedActivity,
  selectedActivity,
  editMode,
  openForm,
  closeForm,
  handlerCreateOrEditActivity,
  deleteActivity,
  submitting,
}: Props) {
  return (
    <>
      <Grid>
        <GridColumn width="10">
          <ActivityList
            activities={activities}
            handleSelectActivity={handleSelectActivity}
            deleteActivity={deleteActivity}
            submitting={submitting}
          />
        </GridColumn>
        <GridColumn width="6" style={{ overflow: "hidden" }}>
          {selectedActivity && !editMode  && (
            <ActivityDetail
              activity={selectedActivity}
              cancelSelectedActivity={cancelSelectedActivity}
              openForm={openForm} 
            />
          )}
          {editMode && <ActivityForms submitting={submitting} closeForm={closeForm} activity={selectedActivity} handlerCreateOrEditActivity={handlerCreateOrEditActivity} /> }
          
        </GridColumn>
      </Grid>
    </>
  );
}
