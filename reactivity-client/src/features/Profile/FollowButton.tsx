import React, { SyntheticEvent } from 'react'
import { Profile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';
import { Button, Reveal } from 'semantic-ui-react';
import { useStore } from '../../stores/store';


interface Props{
    profile:Profile;
}


export default observer(function FollowButton({profile}:Props){
    const {profileStore,userStore}=useStore();
    const {updateFollowing,loadingProfile} = profileStore;

    if(userStore.user?.userName === profile.userName)return null;

    function handleFollow(e:SyntheticEvent,username:string){
        e.preventDefault();
        profile.follow ? updateFollowing(username,false):updateFollowing(username,true);
    }
    return(
        <Reveal animated='move'>
        <Reveal.Content visible style={{width:'100%'}}>
            <Button fluid color='teal' content={profile.follow?"Following":"Not Following"}/>
        </Reveal.Content>
        <Reveal.Content hidden style={{width:'100%'}}>
            <Button
                basic
                fluid
                color={profile.follow?'red':'green'}
                content={profile.follow?"Unfollow":"Follow"}
                loading={loadingProfile}
                onClick={(e)=>handleFollow(e,profile.userName)}
            />
        </Reveal.Content>
    </Reveal>
    )
})