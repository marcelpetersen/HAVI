// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavParams, NavController } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Maps } from '../maps/maps';
//import { Http, HTTP_PROVIDERS} from 'angular2/http';

@Page({
  templateUrl: 'build/pages/settings/settings.html'
})

export class Settings {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params,refresher){
        this.data = params.get('data');
        this.nav = nav;
        this.refresher = refresher;
        //http.get('http://pjsas:Saskespj3@stuart-nieuwpoort.be/api/api.json')
        //    .observer({next: (value) => this.people = value});
    }
    goBackHome(){
        this.nav.pop();
    }
    goMaps(){
        this.nav.push(Maps,{data:this.data.address});
    }
    logOut(){
        localStorage.removeItem('user');
        location.reload();
    }
    
}