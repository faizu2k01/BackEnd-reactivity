import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Container, Header, Segment,Image, Button } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import LoginForm from "../../features/user/loginForm";
import RegisterForm from "../../features/user/registerForm";

export default observer(function HomePage(){
    const {userStore,modalStore} = useStore();
    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as='h1' inverted>
                    <Image size="massive" src='/assets/logo.png' alt='logo-pic' style={{marginBottom:12}}/>
                    Reactivities
                </Header>
                <Header as='h2' inverted content='Welcome to Reactivities'/>
                {
                    userStore.isUserLoggedIn ? <Button as={Link} to='/activities' size="huge" inverted>
                    Go to Activities
                    </Button>

                     : (<>
                     <Button onClick={()=>modalStore.openModal(<LoginForm/>,"Login to Reactivities")} size="huge" inverted>Login!</Button>
                     <Button onClick={()=>modalStore.openModal(<RegisterForm/>,'Register to Reactivities')} size="huge" inverted>Register</Button>
                     </>)
                }
                
            </Container>

        </Segment>
    )
})