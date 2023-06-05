import { Button, Grid, Header , Image} from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import { useStore } from "../../../stores/store";
import { router } from "../../router/routes";

export default function PhotoUploadWidget(){
    const [file,setFile] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();
    const {profileStore:{uplaodingImg,uploadImg}} = useStore();
    const {userStore:{user}} = useStore();

    function onCrop(){
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadImg(blob!));
            router.navigate(`/profiles/${user?.userName}`)
        }
    }


    useEffect(()=>{
        return ()=>{
            file.forEach((file:any)=> URL.revokeObjectURL(file));
        }
    },[file])

    return(
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step-1 - Add Image "/>
                <PhotoWidgetDropzone setFile={setFile}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step-2 - Resize Image "/>
                { file && file.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={file[0].preview}/>
                )
                 }
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color="teal" content="Step-1 - Preview & Image "/>
              {file && file.length>0 &&  <>
                <div className="img-preview" style={{minHeight:200,overflow:'hidden'}}/>
                <Button.Group>
                    <Button loading={uplaodingImg} positive icon='check' onClick={onCrop}/>
                    <Button disabled={uplaodingImg} icon='close' onClick={()=>setFile([])}/>
                </Button.Group>
                </>}
            </Grid.Column>
        </Grid>
    )
}