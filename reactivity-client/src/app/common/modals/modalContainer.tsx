import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStore } from '../../../stores/store'
import {  Modal } from 'semantic-ui-react';

export default observer(function ModalContainer(){
    const {modalStore} = useStore();

    return(
        <>
        
        <Modal open={modalStore.model.open} onClose={modalStore.closeModal} size='mini'>
            <Modal.Description style={{fontSize:20,textAlign:'center',marginTop:15,fontWeight:'bold',color:'teal'}}>{modalStore.model.title != undefined? modalStore.model.title : ''}</Modal.Description>
            <Modal.Content>
                {modalStore.model.body}
            </Modal.Content>

        </Modal>
        </>
    )
})