import React, { useEffect, useState } from 'react';

import './App.css';
import ax from 'axios';
import { Button, Header, List } from 'semantic-ui-react';

function App() {

  
  const [activites,setActivities] = useState([]);
  
  useEffect(()=>{
    
      ax.get(
      'http://localhost:5000/api/activities/get-activity-list'
    ).then(res=>{setActivities(res.data)}
    )},[])
  return (
    <>
    <div>
     <Header as="h2" icon='users' content='Reactivity'/>

      <List>
      {activites.map((x:any)=>{
        return <List.Item key={x.id}>{x.title}</List.Item>
       })}
      </List>
      <Button>Click</Button>

       
    </div>
    </>
  );
}

export default App;
