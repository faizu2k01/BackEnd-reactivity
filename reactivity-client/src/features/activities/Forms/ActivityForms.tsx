import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

interface Props{
  closeForm:()=>void;
  activity:Activity | undefined;
  handlerCreateOrEditActivity:(activity:Activity) => void;
  submitting:boolean;
}


export default function ActivityForms(props:Props) {
 
 const initialActivity = props.activity ?? {
  id: '',
  title: '',
  date: '',
  description: '',
  category: '',
  city: '',
  venue: ''
  }

  const [activity,setActivity] = useState(initialActivity);
 
 
  function handleSubmit(){
   props.handlerCreateOrEditActivity(activity);
 }

function handleOnChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){

  const {name,value} = event.target;
  setActivity({...activity, [name]:value});


}
 
 
 
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
            <Button loading={props.submitting} floated='right' positive type='submit' content="Submit"/>
            <Button onClick={props.closeForm} floated='right'  type='button' content="Cancel"/>

        </Form>
    </Segment>

    </>
  )
}
