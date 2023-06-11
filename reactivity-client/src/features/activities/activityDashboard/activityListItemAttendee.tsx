import { observer } from 'mobx-react-lite'
import React from 'react'
import { List,Image, Popup } from 'semantic-ui-react'
import { Profile } from '../../../app/models/profile'
import { Link } from 'react-router-dom';
import ProfileCard from '../../Profile/ProfileCard';


interface Props{
    attendee:Profile[];
}
export default observer(function ActivityListItemAttendee({attendee}:Props){
  const style={
    borderColor:'orange',
    bordorWidth:2
  }
  
  return (
      <List horizontal>
        {attendee.map((at) => {
          return (
            <Popup
              hoverable
              key={at.userName}
              trigger={
                <List.Item
                  as={Link}
                  to={`/profiles/${at.userName}`}
                  key={at.userName}
                >
                  <Image
                    style={at.follow?style:null}
                    bordered
                    circular
                    size="mini"
                    src={at.image || "/assets/user.png"}
                  />
                </List.Item>
              }
            >
              <Popup.Content>
                <ProfileCard profile={at} />
              </Popup.Content>
            </Popup>
          );
        })}
      </List>
    );
})

