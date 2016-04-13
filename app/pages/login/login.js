// Page:        Facebook log in using Firebase Authentication & Other authentication
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, Platform, NavController } from 'ionic-angular';
 
// Own Pages
import { TabsPage } from '../tabs/tabs';
import { Firebase_const } from '../../const';
import { Facebook } from 'ionic-native';

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
                        this.error = "User already exist";
                        this.login =! this.login; 
                        break;
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        this.error = "E-mailaddress is incorrect";
                        this.login =! this.login; 
                        break;
                    default:
                        console.log("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                     this.firebaseUrl.child('users').child(userData.uid)
                            .set({ email: this.register.email, name: this.register.surname});
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
           this.error = "Password is not correct";
       }
    }
    doneTypingLogin($event){
        if($event.which === 13) {
            this.error = "One second please";          
            if(this.email && this.password){
                // Check if user is correct    
                this.firebaseUrl.authWithPassword({
                    email    : this.email,
                    password : this.password
                }, (error, authData) => {
                if (error) {
                    //console.log("Login Failed!", error);
                    this.error = "User doesn't exist";
                } else {
                    //console.log("Authenticated successfully with payload:", authData);
                    var ref = this.firebaseUrl.child('users').orderByChild('email').startAt(this.email).endAt(this.email);
                    ref.on('value',(snap) => {
                        if(snap.exists() === true){
                              localStorage.setItem('user', Object.keys(snap.val()));
                               this.nav.push(TabsPage); 
                        }else{
                            localStorage.setItem('user',authData.uid);
                            this.nav.push(TabsPage);
                        };
                    });
                }
                });
            }else{
                this.error = "No password/email";
            }   
           
        }
    }
    loginMail(){
            if(this.email && this.password){
                // Check if user is correct    
                this.firebaseUrl.authWithPassword({
                    email    : this.email,
                    password : this.password
                }, (error, authData) => {
                    console.log(authData);
                    if (error) {
                        var ref = this.firebaseUrl.child('users').orderByChild('email').startAt(this.email).endAt(this.email);
                        ref.on('value',(snap) => {
                            if(snap.exists() === true){
                                this.error = "Login with facebook";
                            }else{
                                this.error = "User doesn't exist";
                            };
                        });
                    }else {
                    var ref = this.firebaseUrl.child('users').orderByChild('email').startAt(this.email).endAt(this.email);
                        ref.on('value',(snap) => {
                            if(snap.exists() === true){
                                localStorage.setItem('user', Object.keys(snap.val()));
                            }else{
                                localStorage.setItem('user',authData.uid);
                            };
                             this.nav.push(TabsPage);
                        });
                       
                    }
                });
            }else{
                this.error = "No password/email";
            }   
            this.error = "One second please";   
    }
    loginFacebook(){
         this.angular = "One second please"; 

               
        // Firebase Authentication Popup       
            this.firebaseUrl.authWithOAuthToken("facebook","749773c5de551b6cc07a5a5a17b866f6",(error, authData)=> {
                if (error) {
                    if (error.code === "TRANSPORT_UNAVAILABLE") {
                    // fall-back to browser redirects, and pick up the session
                    // automatically when we come back to the origin page
                    this.firebaseUrl.authWithOAuthRedirect("facebook", (error) => { 
                        // Silence is gold
                    });
                    }else{
                        console.log('hier');
                        console.log(error);
                    }
                }else{
                    var ref = this.firebaseUrl.child('users').orderByChild('email').startAt(authData.facebook.email).endAt(authData.facebook.email);
                    ref.on('value',(snap) => {
                        if(snap.exists() === true){    
                            localStorage.setItem('user', Object.keys(snap.val()));
                            localStorage.setItem('picture', authData.facebook.profileImageURL);
                            this.nav.push(TabsPage); 
                        }else{
                            var ref = this.firebaseUrl.child('users').child(authData.facebook.id)
                                    .set({ email: authData.facebook.email, name: authData.facebook.displayName});
                            localStorage.setItem('user', authData.facebook.id);
                            localStorage.setItem('picture', authData.facebook.profileImageURL);
                            this.nav.push(TabsPage); 
                        };
                    });
                }
        },{
             scope: "email,public_profile"
        });

    }
}