import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../Home/HomePage";
import ActivityDashboard from "../../features/activities/activityDashboard/ActivityDashboard";
import ActivityForms from "../../features/activities/Forms/ActivityForms";
import ActivityDetail from "../../features/activities/activityDetails/ActivityDetail";

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
        ]
    },
   
]

export const  router = createBrowserRouter(routes);