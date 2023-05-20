import React, { Fragment, useEffect, useState } from "react";
import "./styles.css";
import {  Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../Home/HomePage";
import { ToastContainer } from "react-toastify";
import { useStore } from "../../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/modalContainer";

function App() {
  const location = useLocation();
  const {commonStore,userStore} = useStore();


  useEffect(()=>{
    if(commonStore.token){
      userStore.getUser().finally(()=>commonStore.setAppLoaded());
    }else{
      commonStore.setAppLoaded();
    }
  },[commonStore,userStore])


  if(!commonStore.isAppLoaded) <LoadingComponent content="Loading App..."/>
return (
      <Fragment> 
        <ModalContainer/>
       <ToastContainer hideProgressBar position="bottom-right" theme="colored"/>
        {location.pathname === '/'?<HomePage/>:(
          <>
          <NavBar/>
            <Container style={{marginTop:'7em'}}>
                <Outlet/>
            </Container>
          </>
        )} 
        
      </Fragment>
    
  );
}

export default observer(App);
