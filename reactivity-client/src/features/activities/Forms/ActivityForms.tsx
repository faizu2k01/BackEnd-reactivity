import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, FormField, Header, Label, Segment } from 'semantic-ui-react'
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import {v4 as uuid} from 'uuid';
import { Formik,Form,Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MyInput from '../../../app/common/Form/MyInput';
import MyArea from '../../../app/common/Form/MyArea';
import { selectoptions } from '../../../app/common/Form/options/selectoptions';
import MySelect from '../../../app/common/Form/MySelect';
import MyDate from '../../../app/common/Form/MyDate';
import { Activity } from '../../../app/models/activity';

export default observer(function ActivityForms() {
  const {activityStore} = useStore();
  const {selectedActivity,updateActivity,createActivity,loading,loadingActivityDetail,loadingInitial} = activityStore;
  const {id} = useParams();
  const nevigate = useNavigate();
  const [activity,setActivity] = useState<Activity>({
    id: '',
    title: '',
    date: null,
    description: '',
    category: '',
    city: '',
    venue: ''
    });

  const validation = Yup.object({
    title: Yup.string().required('title needed'),
    date: Yup.string().required('date needed').nullable(),
    description: Yup.string().required('description needed'),
    category: Yup.string().required('category needed'),
    city: Yup.string().required('city needed'),
    venue: Yup.string().required('venue needed'),
  })

  useEffect(()=>{
   if(id) loadingActivityDetail(id).then(activity=> setActivity(activity!));
  
  },[id,loadingActivityDetail])
 
 
  function handleFormSubmit(activity:Activity){
    if(!activity.id){
      activity.id = uuid();
      createActivity(activity).then(()=>nevigate(`/activities/${activity.id}`));
    }else{
      updateActivity(activity).then(()=>nevigate(`/activities/${activity.id}`));
    }
     
 }


 
 
  if(loadingInitial) return <LoadingComponent content='Loading activity...'/>
 
  return (
    
      <Segment clearing>
        <Header sub content="Activity Details" color='teal' />
        <Formik validationSchema={validation} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
          {({ handleSubmit,isValid,isSubmitting,dirty, }) => (
            <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
             
              <MyInput name='title' placeholder='Title'/>
              <MyArea row={3} placeholder="Description" name="description" />
              <MySelect options={selectoptions} placeholder="Category" name="category" />
              <MyDate  placeholderText="Date"  name="date" showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa'/>
              <Header sub content='Location Details' color='teal'/>
              <MyInput placeholder="City" name="city" />
              <MyInput placeholder="Venue" name="venue" />
              <Button 
               disabled = {isSubmitting || !dirty || !isValid}
              loading={loading} floated="right" positive type="submit" content="Submit" />
              <Button as={Link} to={`/activities/${activity.id}`} floated="right" type="button" content="Cancel"/>
            </Form>
           )}
        </Formik>
      </Segment>
    
  );
})
