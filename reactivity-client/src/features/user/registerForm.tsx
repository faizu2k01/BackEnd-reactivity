import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import MyInput from '../../app/common/Form/MyInput'
import { Button, Label } from 'semantic-ui-react'
import { useStore } from '../../stores/store'
import * as Yup from 'yup'
import { error } from 'console'
import ValidationError from '../errors/ValidationError'

export default observer(function RegisterForm(){

    const {userStore} = useStore();
    const validation = Yup.object({
        displayName:Yup.string().required("display name needed"),
        userName:Yup.string().required("user name needed"),
        email:Yup.string().required("email name needed"),
        password:Yup.string().required("password name needed")
    })


    return (
        <Formik validationSchema={validation} initialValues={{email:'',displayName:'',userName:'',password:'',error:null}}
         onSubmit={(values,{setErrors})=> userStore.register(values).catch(error=>setErrors({error}))}>
           {({handleSubmit,isSubmitting,isValid,dirty,errors})=>{
            return (
                <Form className='ui form error' autoComplete='off' onSubmit={handleSubmit} >
                <MyInput placeholder='Display Name' name="displayName"/>
                <MyInput placeholder='User Name' name="userName"/>
                <MyInput placeholder='Email' name="email" type='email'/>
                <MyInput placeholder='Password' name="password"/>
                <ErrorMessage name='error' render={()=> <ValidationError errors={errors.error}/>}/>
                <Button loading={isSubmitting} disabled={isSubmitting || !isValid || !dirty} content="Register" positive type='submit' fluid/>
            </Form>
            )
           }}

        </Formik>
    )
})