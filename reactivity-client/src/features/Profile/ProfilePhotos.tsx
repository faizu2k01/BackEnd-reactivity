import { observer } from 'mobx-react-lite'
import React, { useState,SyntheticEvent } from 'react'
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react'
import { useStore } from '../../stores/store'
import PhotoUploadWidget from '../../app/common/ImageUpload/PhotoUploadWidget'
import { Photo } from '../../app/models/profile'


export default observer(function ProfilePhotos(){
    const {profileStore:{profiles,userCheck,setMainImage,loadingsetMain,deleteImageNotMain}} = useStore();
    const [addPhoto,setAddPhotoMode] = useState(false);
    const [target,settarget] = useState("");

   function handleSetTerget(photo:Photo,e:SyntheticEvent<HTMLButtonElement>){
    settarget(e.currentTarget.name);
    setMainImage(photo);
   }


   function deleteImage(photo:Photo,e:SyntheticEvent<HTMLButtonElement>){
    settarget(e.currentTarget.name);
    deleteImageNotMain(photo);
   }
   
    return(
        <Tab.Pane>
          <Grid >
            <Grid.Column width={16}>
            <Header floated='left' content="Photos" icon="image"/>
            {userCheck && 
               <Button basic floated='right' 
               content = {addPhoto?"Cancel":"Add Photo"}
               onClick={()=> setAddPhotoMode(!addPhoto)}
               />
            }
            </Grid.Column>
            <Grid.Column width={16}>
                {
                    addPhoto ?
                    (
                        <PhotoUploadWidget/>
                    ) :
                    (
                        <Card.Group itemsPerRow={5}>
                           {
                             profiles?.photos && profiles?.photos?.map(ph=>{
                              return ( <Card key={ph.id}>
                                    <Image src={ph.url}/>
                                    {userCheck &&
                                    <Button.Group fluid widths={2}>
                                        <Button
                                            basic
                                            color='green'
                                            content='Main'
                                            name={'main'+ph.id}
                                            disabled={ph.isMain}
                                            loading={target ==='main'+ ph.id && loadingsetMain}
                                            onClick={e => handleSetTerget(ph,e)}
                                        />
                                        <Button 
                                        color='red'
                                         basic
                                          icon='trash'
                                          name={ph.id}
                                          disabled={ph.isMain}
                                          loading={target === ph.id && loadingsetMain}
                                          onClick={e => deleteImage(ph,e)}
                                          
                                          />
                                    </Button.Group>
                                    }
                                </Card>)
                            })
                           }
                            <Card>

                            </Card>
                        </Card.Group>
                    )
                }
            </Grid.Column>
          </Grid>
        </Tab.Pane>
    )
})