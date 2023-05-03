import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';



export default observer(function ActivityDetail(){
 const {activityStore} = useStore();
 const {selectedActivity:activity,openForm,cancelSelectedActivity} = activityStore;
  if(!activity) return <LoadingComponent/>
  return(
    <>
    <Card fluid>
      <Image src={`./assets/categoryImages/${activity.category}.jpg`}></Image>
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>{activity.date}</Card.Meta>
        <Card.Description>{activity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>

          <Button onClick={()=> openForm(activity.id)} basic color='blue' content='Edit'/>
          <Button onClick={cancelSelectedActivity} basic color='grey' content='Cancel'/>

        </Button.Group>
      </Card.Content>
    </Card>
    </>
  )
})