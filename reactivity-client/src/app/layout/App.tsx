import React, { Fragment, useEffect, useState } from "react";
import "./styles.css";
import {  Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../Home/HomePage";

function App() {
  const location = useLocation();
return (
      <Fragment> 
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
