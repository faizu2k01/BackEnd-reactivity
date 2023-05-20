import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../Home/HomePage";
import ActivityDashboard from "../../features/activities/activityDashboard/ActivityDashboard";
import ActivityForms from "../../features/activities/Forms/ActivityForms";
import ActivityDetail from "../../features/activities/activityDetails/ActivityDetail";
import ExceptionErrors from "../../features/errors/ExceptionErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/user/loginForm";

export const routes:RouteObject[] = [
    {
        path:'/',
        element:<App/>,
        children:[
            {path:'',element:<HomePage/>},
            {path:'activities',element:<ActivityDashboard/>},
            {path:'activities/:id',element:<ActivityDetail/>},
            {path:'createActivity',element:<ActivityForms key="create"/>},
            {path:'manage/:id',element:<ActivityForms key="manage"/>},
            {path:'login',element:<LoginForm key="login"/>},
            {path:'errors',element:<ExceptionErrors/>},
            {path:'not-found',element:<NotFound/>},
            {path:'server-error',element:<ServerError/>},
            {path:'*',element:<Navigate  replace to='/not-found'/>},
        ]
    },
   
]

export const  router = createBrowserRouter(routes);