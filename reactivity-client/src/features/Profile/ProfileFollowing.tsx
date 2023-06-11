import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useStore } from '../../stores/store'
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import ProfileCard from './ProfileCard';


export default observer(function ProfileFollowing(){
    const {profileStore:{loadingFollowing,profiles,following,activeTab}}=useStore();

    return(
        <Tab.Pane loading={loadingFollowing}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user'
                     content={activeTab === 3?`People following ${profiles?.displayName}`:`People ${profiles?.displayName} is following`}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group>
                        {following.map(profile=>(
                            <ProfileCard profile={profile} key={profile.userName}/>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>


    )
})