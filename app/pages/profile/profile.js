// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavController, NavParams } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Settings } from '../settings/settings';

@Page({
  templateUrl: 'build/pages/profile/profile.html'
})

export class Profile {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav){
        this.profileImg = Cookie.getCookie('picture');
        this.nav = nav;
    }
    goSettings(){
        this.nav.push(Settings);
    }
}