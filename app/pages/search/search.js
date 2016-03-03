// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';

@Page({
  templateUrl: 'build/pages/search/search.html'
})

export class Search {
  
  constructor() {
       this.firebaseUrl = Firebase_const.API_URL;
       this.show = true;
       this.name = Cookie.getCookie('user');
       if(!this.name){
            this.error = "Eerst inloggen a.u.b.";
       }
       this.cities = observableFirebaseArray(
           new Firebase(this.firebaseUrl).child('cities').limitToLast(5));
  }
  
  
  doneTyping($event) {
        if($event.which === 13) {
            this.addMessage($event.target.value);
            $event.target.value = null;
        }
  }
  send(e){
        this.addMessage(e);
        this.textMessage = null;
  }
  addMessage(message) {
        var newString = message;
        this.date = new Date;
        this.ref = new Firebase(this.firebaseUrl)
                            .child('messages')
                            .child(Cookie.getCookie('city'));
        if(this.name && message){
            this.ref.push({
                name: this.name,
                text: newString,
                datetime: new Date().toDateString()
            });            
        }
  }
  chooseCity(e){
    Cookie.setCookie('city',e.name);
    this.messages = observableFirebaseArray(
           new Firebase(this.firebaseUrl).child('messages').child(e.name).limitToLast(5));
    this.show = false;
    
  }
  back(){
      this.show =! this.show;
      Cookie.deleteCookie('city');
  }
  
  
  // Search https://www.firebase.com/blog/2013-10-01-queries-part-one.html
  searchQeury($event){
    var e = $event.target.value;
    
    if($event.which === 13) {
        console.log(e);
        new Firebase(this.firebaseUrl).child('users')
            .startAt(e)
            .endAt(e)
            .once('value', function(snap) {
            console.log('accounts matching email address', snap.val())
        });
    }

  }
  activeClass(e){
       this.firstClass = "";
       this.secondClass = "";
       this.tirthClass = "";
       switch (e) {
           case 1:
                  this.firstClass = "active";
           break;
           case 2:
                  this.secondClass = "active";
                  this.firstClass += "middle";
           break;
           case 3:
                  this.tirthClass = "active";
                  this.secondClass = "middle";
               break;
       }
  }
}


