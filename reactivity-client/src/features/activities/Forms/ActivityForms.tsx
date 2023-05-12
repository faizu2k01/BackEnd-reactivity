import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {v4 as uuid} from 'uuid';

export default observer(function ActivityForms() {
  const {activityStore} = useStore();
  const {selectedActivity,updateActivity,createActivity,loading,loadingActivityDetail,loadingInitial} = activityStore;
  const {id} = useParams();
  const nevigate = useNavigate();
  const [activity,setActivity] = useState({
    id: '',
    title: '',
    date: '',
    description: '',
    category: '',
    city: '',
    venue: ''
    });

  useEffect(()=>{
   if(id) loadingActivityDetail(id).then(activity=> setActivity(activity!));
  
  },[id,loadingActivityDetail])
 
 
  function handleSubmit(){
    if(!activity.id){
      activity.id = uuid();
      createActivity(activity).then(()=>nevigate(`/activities/${activity.id}`));
    }else{
      updateActivity(activity).then(()=>nevigate(`/activities/${activity.id}`));
    }
     
 }

function handleOnChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
  const {name,value} = event.target;
  setActivity({...activity, [name]:value});
}
 
 
  if(loadingInitial) return <LoadingComponent content='Loading activity...'/>
 
  return (
    <>
    <Segment clearing>
        <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleOnChange}/>
            <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleOnChange}/>
            <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleOnChange}/>
            <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleOnChange}/>
            <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleOnChange}/>
            <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleOnChange}/>
            <Button loading={loading} floated='right' positive type='submit' content="Submit"/>
            <Button as={Link} to={`/activities/${activity.id}`} floated='right'  type='button' content="Cancel"/>

        </Form>
    </Segment>

    </>
  )
})
