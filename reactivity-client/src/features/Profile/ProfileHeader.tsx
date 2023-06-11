import { observer } from 'mobx-react-lite'
import React from 'react'
import {  Grid, Header, Item, Segment, Statistic } from 'semantic-ui-react'
import { useStore } from '../../stores/store'
import FollowButton from './FollowButton'


export default observer(function ProfileHeader(){
    const {profileStore} = useStore();
    const {profiles} = profileStore;

    return(
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profiles?.image||'/assets/user.png'}/>
                            <Item.Content verticalAlign='middle'>
                                    <Header as='h1' content={profiles?.displayName}/>
                            </Item.Content>
                        </Item>
                    </Item.Group>

                </Grid.Column>
                <Grid.Column width={4}>
                        <Statistic.Group widths={2}>
                            <Statistic label="Followers" value={profiles?.followerCount}/>
                            <Statistic label="Following" value={profiles?.followingCount}/>
                        </Statistic.Group>
                       <FollowButton profile={profiles!}/>
                </Grid.Column>
            </Grid>
        </Segment>
    )
})