import { ErrorMessage, Form, Formik } from 'formik'
import React from 'react'
import MyInput from '../../app/common/Form/MyInput'
import { Button, Label } from 'semantic-ui-react'
import { useStore } from '../../stores/store'
import * as Yup from 'yup'
import { error } from 'console'
import { observer } from 'mobx-react-lite'

export default observer(function LoginForm(){
    const {userStore} = useStore();
    const validationSchema = Yup.object({
        email:Yup.string().required("Email needed"),
        password:Yup.string().required("password needed")

    });
    return (
        <Formik validationSchema={validationSchema} initialValues={{email:"",password:"",error:null}} onSubmit={(values,{setErrors}) => userStore.login(values).
        catch(error =>setErrors({error:"Invalid email or password correct them pls"}))} >

            {({handleSubmit,isSubmitting,isValid,dirty,errors})=>{
                return (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyInput placeholder='Email' name="email"/>
                        <MyInput placeholder='Password' name="password" type='password'/>
                        <ErrorMessage name='error' render={()=> <Label style={{marginBottom:10}} basic color='red' content={errors.error}/>}/>
                        <Button disabled={isSubmitting || !isValid || !dirty} loading={isSubmitting} positive content='Login' type='submit' fluid/>

                    </Form>
                )
            }}

        </Formik>
    )
})