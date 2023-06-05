import { Button, Container, Menu, Image, Dropdown } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';


export default observer(function NavBar() {

  const {userStore:{user,isUserLoggedIn,logout}} = useStore();
  
  return (
    <>
      <Menu inverted fixed='top'>
        <Container>
            <Menu.Item as={NavLink} to="/" header>
                <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}} />
                Reactivities
            </Menu.Item>
            <Menu.Item as={NavLink} to="/activities" name='Activities' />
            <Menu.Item as={NavLink} to="/errors" name='Errors' />
            <Menu.Item>
                <Button as={NavLink} to="/createActivity" positive content="Create Activity"></Button>
            </Menu.Item>

            {
              
              isUserLoggedIn &&  <Menu.Item position='right'>
                <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                <Dropdown pointing='top right' text={user?.displayName}>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/profiles/${user?.userName}`} text='My Profile' icon='user'/>
                    <Dropdown.Item text='Logout' icon='power' onClick={logout}/>
                  </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
            }




        </Container>
      </Menu>
    </>
  )
})
