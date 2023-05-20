import { makeAutoObservable } from "mobx";

interface Modal{
    title:string|undefined,
    open:boolean,
    body:JSX.Element|null;
}
export default class ModalStore{
    model : Modal = {
        title:undefined,
        open:false,
        body:null
    }
   
    open:boolean=false;
    body:string | null= null;

    constructor() {
       makeAutoObservable(this);
    }


    openModal=(content:JSX.Element,title?:string)=>{
        this.model.title=title;
        this.model.body=content;
        this.model.open = true;
    }

    closeModal=()=>{
        this.model.title = '';
        this.model.body = null;
        this.model.open= false;
    }
}