// Page:        Facebook log in using Firebase Authentication & Other authentication
// Author:      Pieter-Jan Sas
// Last update: 20/02/16
// TODO: Icons vervangen in html door ionic 2

import { Page, Platform, NavController } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';

// Own Pages
import { TabsPage } from '../tabs/tabs';
import { Firebase_const } from '../../const';

// Directives in app/directives/..
//import { Data } from '../../directives/data';

@Page({
  selector:'Login',
  //directives: [Data],
  templateUrl: 'build/pages/login/login.html'
})

export class Login {
    static get parameters() {
        return [[NavController]];
    }
    constructor(nav) {
        this.title = "Login";
        this.nav = nav;
        this.firebaseUrl = new Firebase(Firebase_const.API_URL);
        this.email = ""; 
        this.password = "";
    }
    register(){
        
        this.error = "";
       if(this.register.password == this.register.passwordRepeat){
        // Create user
        this.firebaseUrl.child('users').createUser({
                email    : this.register.email,
                password : this.register.password
            }, (error, userData) => {
                if (error) {
                    switch (error.code) {
                    case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use.");
                        this.error = "Account bestaat al";
                        this.login =! this.login; 
                        break;
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        this.error = "E-mailadres is incorrect";
                        this.login =! this.login; 
                        break;
                    default:
                        console.log("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                     this.firebaseUrl.child('users').child(this.register.username).set({ email: this.register.email, name: this.register.surname });
                     // Clear all
                     this.login =! this.login;
                     this.email = this.register.email;
                     this.password = "";
                     this.register.surname = "";
                     this.register.email = "";
                     this.register.password = "";
                     this.register.username = "";
                     this.register.passwordRepeat = "";
                }
            }); 
       }else{
           this.error = "Paswoord is niet correct";
       }

    }
    loginMail(){
            if(this.email && this.password){
                // Check if user is correct    
                this.firebaseUrl.authWithPassword({
                    email    : this.email,
                    password : this.password
                }, (error, authData) => {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    //console.log("Authenticated successfully with payload:", authData);
                    
                    localStorage.setItem('user',authData.uid);
                    this.nav.push(TabsPage);
                }
                });
                // https://egghead.io/lessons/angular-2-passing-data-to-components-with-input
            }else{
                this.error = "No password/email";
                console.log('No Credentials');
            } 
    }
    loginFacebook(){
         this.angular = "Even geduld a.u.b.";        
        // Firebase Authentication Popup       
            this.firebaseUrl.authWithOAuthPopup("facebook",function(error, authData) {
            if (error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                // fall-back to browser redirects, and pick up the session
                // automatically when we come back to the origin page
                this.firebaseUrl.authWithOAuthRedirect("facebook", function(error) { 
                    // Silence is gold
                });
                }else{
                    console.log(error);
                }
            }else{
                remember: "sessionOnly";
                scope: "email";
                this.name = authData.facebook.displayName;
                // Set up Cookie for authentication multipage
                localStorage.setItem('user', authData.facebook.displayName);
            }
        });

    }
   
}