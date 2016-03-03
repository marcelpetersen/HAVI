// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavParams, NavController } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {Maps} from '../maps/maps';


@Page({
  templateUrl: 'build/pages/trip/trip.html'
})

export class Trip {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params){
        this.data = params.get('data');
        this.nav = nav;
    }
    goBackHome(){
        this.nav.pop();
    }
    goMaps(){
        this.nav.push(Maps,{data:this.data.address});
    }
    
}