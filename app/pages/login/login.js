// Page:        Facebook log in using Firebase Authentication & Other authentication
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, Platform, NavController } from 'ionic-angular';
import { Facebook } from 'ionic-native';

// Pages & constants
import { Firebase_const }   from '../../const';
import { TabsPage }         from '../tabs/tabs';

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
                    localStorage.setItem("first",true);
                    this.firebaseUrl.child('users').child(userData.uid)
                            .set({ 
                                email: this.register.email, 
                                name: this.register.surname.toLowerCase(),
                                private:false
                            });
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
                                var key = Object.keys(snap.val())[0];
                                localStorage.setItem('user', key);
                                localStorage.setItem('name', snap.val()[key].name);
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
                                localStorage.setItem('name', snap.val().name);
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
        // Firebase Authentication Popup       
            this.firebaseUrl.authWithOAuthPopup("facebook",(error, authData)=> {
                if (error) {
                    if (error.code === "TRANSPORT_UNAVAILABLE") {
                    // fall-back to browser redirects, and pick up the session
                    // automatically when we come back to the origin page
                    this.firebaseUrl.authWithOAuthRedirect("facebook", (error) => { 
                        // Silence is gold
                    });
                    }else{
                        console.log(error);
                    }
                }else{
                    var ref = this.firebaseUrl.child('users').orderByChild('email').startAt(authData.facebook.email).endAt(authData.facebook.email);
                    ref.once('value',(snap) => {
                        if(snap.exists() === true){    
                            localStorage.setItem('user', Object.keys(snap.val()));
                            localStorage.setItem('picture', authData.facebook.profileImageURL);
                            var valueOfKey = snap.val()[Object.keys(snap.val())[0]].pictureUrl;
                            if(!valueOfKey){
                                 var ref = this.firebaseUrl.child('users').child(Object.keys(snap.val()).toString());
                                 ref.update({pictureUrl:authData.facebook.profileImageURL});
                            }
                            this.nav.push(TabsPage); 
                        }else{
                            var ref = this.firebaseUrl.child('users').child(authData.facebook.id)
                                    .set({ 
                                        email: authData.facebook.email, name: authData.facebook.displayName.toLowerCase(),
                                        pictureUrl:authData.facebook.profileImageURL,
                                        private:false
                                    });
                            localStorage.setItem('user', authData.facebook.id);
                            localStorage.setItem('picture', authData.facebook.profileImageURL);
                            localStorage.setItem('name', authData.facebook.displayName);
                            this.nav.push(TabsPage); 
                        };
                    });
                }
        },{
             scope: "email,public_profile"
        });
       /*
        //Facebook.browserInit(1735591183389964);
        try {
            Facebook.login(["public_profile"],success => {
                    console.log(success);
                    this.error = success;
                    this.nav.push(TabsPage);
                },error => {
                    this.error = error;
                    console.log(error);
                });
        }
        catch(err) {
             this.error = err;
        }
         */
    }
}