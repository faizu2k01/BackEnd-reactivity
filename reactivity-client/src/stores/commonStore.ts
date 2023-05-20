import { makeAutoObservable } from 'mobx';
import { Error } from '../app/models/errors';
import React from 'react'

export default class CommonStore{
    errors:Error | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    setServerError(err:Error){
        this.errors  = err;
    }
}