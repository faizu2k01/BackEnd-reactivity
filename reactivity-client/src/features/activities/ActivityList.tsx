import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../app/models/activity";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";


export default observer(function ActivityList() {
  const {activityStore} = useStore();
  const {setSelectedActivity:handleSelectActivity,activitySortedByDate,deleteActivity,loading}=activityStore;
  const [target,setTarget]=useState('');

  function handleDeleteEvent(e:SyntheticEvent<HTMLButtonElement>,id:string){
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }
  
  
  return (
    <>
      <Segment>
        <Item.Group divided>
          {activitySortedByDate.map((activity) => {
            return <Item key={activity.id}>
                <Item.Content>
                    <Item.Header as='a'>
                        {activity.title}
                    </Item.Header>
                    <Item.Meta>
                       {activity.date} 
                    </Item.Meta>
                    <Item.Description>
                        <div>{activity.description}</div>
                        <div>{activity.city},{activity.venue}</div>
                    </Item.Description>
                    <Item.Extra>
                        <Button onClick={()=> handleSelectActivity(activity.id)} floated='right' content="View" color="blue"></Button>
                        <Button name={activity.id}  loading={loading && target === activity.id} onClick={(e)=> handleDeleteEvent(e,activity.id)} floated='right' content="Delete" color="red"></Button>
                        <Label basic content={activity.category.charAt(0).toUpperCase()+activity.category.slice(1)}/>
                    </Item.Extra>
                </Item.Content>
            </Item>;
          })}
        </Item.Group>
      </Segment>
    </>
  );
})
