import { observer } from 'mobx-react-lite'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos'
import ProfileFollowing from './ProfileFollowing'
import { useStore } from '../../stores/store'

export default observer(function ProfileContent(){
   const {profileStore:{setActiveTab}}= useStore();
   const panes = [
    {menuItem:'About',render:()=><Tab.Pane>About Content</Tab.Pane>},
    {menuItem:'Photos',render:()=><ProfilePhotos/>},
    {menuItem:'Events',render:()=><Tab.Pane>Events Content</Tab.Pane>},
    {menuItem:'Followers',render:()=><ProfileFollowing/>},
    {menuItem:'Following',render:()=><ProfileFollowing/>},
]
    return (
        <Tab
         menu={{fluid:true,vertical:true}}
         menuPosition='right'
         panes={panes}
         onTabChange={(e,data)=>setActiveTab(data.activeIndex)}
        
        />
    )
})