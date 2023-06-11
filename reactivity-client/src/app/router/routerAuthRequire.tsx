import React from 'react'
import { useStore } from '../../stores/store'
import { Navigate, Outlet, useLocation } from 'react-router-dom';



export default function RouterAuthRequire(){

 const {userStore:{isUserLoggedIn}}=useStore();
 const location = useLocation();
    
        if(!isUserLoggedIn){
            return(
                <Navigate to='/' state={{from:location}}/>
            )
        }

        return (<Outlet/>)

}