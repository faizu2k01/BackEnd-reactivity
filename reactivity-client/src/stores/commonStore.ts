import { makeAutoObservable, reaction } from 'mobx';
import { Error } from '../app/models/errors';
import React from 'react'

export default class CommonStore{
    errors:Error | null = null;
    token:string | null = localStorage.getItem('jwt');
    isAppLoaded:boolean=false;

    constructor(){
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token =>{
                if(token){ localStorage.setItem('jwt',token);}
                else { localStorage.removeItem('jwt');}
            }
        )
    }

    setServerError(err:Error){
        this.errors  = err;
    }

    setAppLoaded(){
        this.isAppLoaded=true;
    }

    setToken(token:string){
            this.token = token;
    }
}