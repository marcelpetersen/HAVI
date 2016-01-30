// App:         Secure Albums with pictures taking with camera or from Photo album
//              -> Secure by code or authentication   
//              -> Small messaging example 
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { App, Platform, Config } from 'ionic/ionic';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TabsPage } from './pages/tabs/tabs';
import { Login } from './pages/login/login';


@App({
  templateUrl: 'build/app.html',
  // Check out the config API docs for more info
  // http://ionicframework.com/docs/v2/api/config/Config/
  config: {
      
      
  }
})

export class MyApp {
  constructor(platform: Platform) {
        // Check if user already logged in go to different pages
        this.name = Cookie.getCookie('user');
        if(!this.name){
            this.root = Login;
        }else{
            this.root = TabsPage;
        }
    platform.ready().then(() => {
      // Do any necessary cordova or native calls here now that the platform is ready

    });
  }
}