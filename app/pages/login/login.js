// Page:        Facebook log in using Firebase Authentication
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, Platform, NavController } from 'ionic/ionic';
import { Cookie } from 'ng2-cookies/ng2-cookies';
// Own Pages
import { TabsPage } from '../tabs/tabs';
// Directives in app/directives/..
import { Data } from '../../directives/data';

@Page({
  name:'login',
  path: '/login',
  directives: [Data],
  templateUrl: 'build/pages/login/login.html',
})


export class Login {
    constructor(nav: NavController) {
        this.title = "Login";
        this.nav = nav;
    }
    login(){
         this.angular = "Even geduld a.u.b.";        
         var ref = new Firebase("https://gsecure.firebaseio.com");
         // Firebase Authentication Popup       
            ref.authWithOAuthPopup("facebook",function(error, authData) {
            if (error) {
                 if (error.code === "TRANSPORT_UNAVAILABLE") {
                // fall-back to browser redirects, and pick up the session
                // automatically when we come back to the origin page
                ref.authWithOAuthRedirect("facebook", function(error) { /* ... */ });
                }else{
                     console.log(error);
                }
            } else {
            remember: "sessionOnly";
            scope: "email";
            this.name = authData.facebook.displayName;
                // Set up Cookie for authentication multipage
                Cookie.setCookie('user', authData.facebook.displayName);
            }
        });
        // Go to TabsPage
        this.nav.push(TabsPage);
    }
}