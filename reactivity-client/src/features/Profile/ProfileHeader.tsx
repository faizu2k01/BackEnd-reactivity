import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react'
import { useStore } from '../../stores/store'
import LoadingComponent from '../../app/layout/LoadingComponent'


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
                            <Statistic label="Followers" value='4'/>
                            <Statistic label="Following" value='45'/>
                        </Statistic.Group>
                        <Reveal animated='move'>
                            <Reveal.Content visible style={{width:'100%'}}>
                                <Button fluid color='teal' content="Following"/>
                            </Reveal.Content>
                            <Reveal.Content hidden style={{width:'100%'}}>
                                <Button
                                    basic
                                    fluid
                                    color={true?'red':'green'}
                                    content={true?"Unfollow":"Follow"}
                                />

                            </Reveal.Content>
                        </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
})