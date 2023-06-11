import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import ProfileHeader from './ProfileHeader'
import { Grid } from 'semantic-ui-react'
import ProfileContent from './ProfileContent'
import { useStore } from '../../stores/store'
import { useParams } from 'react-router-dom'
import LoadingComponent from '../../app/layout/LoadingComponent'

export default observer(function ProfilePage(){
    const {username} = useParams();
    const {profileStore} = useStore();
    const {loadingProfile,profiles,loadingProf,setActiveTab} = profileStore;

    useEffect(()=>{
        if(username) loadingProf(username);
        return ()=>setActiveTab(0);
    },[loadingProf,username])

    if(loadingProfile) <LoadingComponent content='loading profile'/>
    return (
        <Grid>
            <Grid.Column width={16}>
                {profiles &&
                <>
                <ProfileHeader/>
                <ProfileContent/>
                </>}
                
            </Grid.Column>
        </Grid>
    )
})