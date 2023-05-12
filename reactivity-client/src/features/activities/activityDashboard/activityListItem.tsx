import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useState } from 'react'
import { useStore } from '../../../stores/store';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { Link } from 'react-router-dom';

export interface Props{
    activity:Activity
}
export default observer(function ActivityListItem({activity}:Props){
    const {activityStore} = useStore();
    const {deleteActivity,loading}=activityStore;
    const [target,setTarget]=useState('');

  function handleDeleteEvent(e:SyntheticEvent<HTMLButtonElement>,id:string){
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }
    return(
       <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png'/>
                       <Item.Content>
                       <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                        <Item.Description>Hosted By Bob</Item.Description>
                       </Item.Content>
                    </Item>
                </Item.Group>

            </Segment>
            <Segment>
                <span>
                    <Icon name='clock'/> {activity.date}
                    <Icon name='marker'/> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <span>Attendees go here</span>
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View'/>
            </Segment>
       </Segment.Group>

    )
})