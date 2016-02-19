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
         
            /*
            // Firebase Authentication Popup       
                ref.authWithOAuthPopup("facebook",function(error, authData) {
                if (error) {
                    if (error.code === "TRANSPORT_UNAVAILABLE") {
                    // fall-back to browser redirects, and pick up the session
                    // automatically when we come back to the origin page
                    ref.authWithOAuthRedirect("facebook", function(error) { 
                        // Silence is gold
                    });
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
            });*/
        
            
            
            // Create user
            /*
            ref.child('users').createUser({
            email    : "pieter_jansas@hotmail.com",
            password : "pieterjans"
            }, function(error, userData) {
            if (error) {
                switch (error.code) {
                case "EMAIL_TAKEN":
                    console.log("The new user account cannot be created because the email is already in use.");
                    break;
                case "INVALID_EMAIL":
                    console.log("The specified email is not a valid email.");
                    break;
                default:
                    console.log("Error creating user:", error);
                }
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            }
            });*/
                
            if(this.email && this.password){
                // Check if user is correct    
                var ref = new Firebase("https://gsecure.firebaseio.com/users");
                ref.authWithPassword({
                email    : this.email,
                password : this.password
                }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    Cookie.setCookie('user', authData.uid);
                }
                });
                 this.nav.push(TabsPage); 
            }else{
                console.log('No Credentials');
            } 


           
             
          

    }
}