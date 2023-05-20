import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'

export default function NotFound(){
    return (
        <Segment placeholder>
            <Header icon style={{textAlign:'center'}}>
                <Icon name='search' style={{marginTop:'10px'}}/>
                    Oops - we've looked everywhere but couldn't find what you are looking for!
               
            </Header>
            <Segment.Inline>
                <Button as={Link} to="/activities">
                    go to activities
                </Button>
            </Segment.Inline>
        </Segment>
    )
}