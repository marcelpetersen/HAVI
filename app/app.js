// App:         Secure Albums with pictures taking with camera or from Photo album
//              -> Secure by code or authentication   
//              -> Small messaging example 
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { App, Platform, Config  } from 'ionic-angular';
import { enableProdMode } from 'angular2/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {TabsPage} from './pages/tabs/tabs';
import { Login } from './pages/login/login';


@App({
  template: '<ion-nav id="nav" [root]="root" #content></ion-nav>',
  // Check out the config API docs for more info
  // http://ionicframework.com/docs/v2/api/config/Config/
  config: {
      
      
  }
})


export class MyApp {
  static get parameters() {
    return [[Platform]];
  }
  //static get API_URL(): string { return 'https://havas.firebaseio.com/'; }

  constructor(platform) {
        // Check if user already logged in go to different pages
        this.name = Cookie.getCookie('user');
        if(!this.name){
            this.root = Login;
        }else{
            this.root = TabsPage;
        }
    platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }
}

