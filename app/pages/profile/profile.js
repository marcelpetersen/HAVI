// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Page({
  templateUrl: 'build/pages/profile/profile.html'
})

export class Profile {
    constructor(){
        this.profileImg = Cookie.getCookie('picture');
    }
}