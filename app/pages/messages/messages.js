// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Pipe} from 'angular2/core';


@Page({
  templateUrl: 'build/pages/messages/messages.html',
  //pipes: [customPipe]
})

export class Messages {
  constructor() {
       this.firebaseUrl = Firebase_const.API_URL;
       this.show = true;
       this.name = localStorage.getItem('user');
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
}

// Translate name into real name
@Pipe({name: 'custom'})
export class customPipe {
 transform(value){
     if(value){
          return value;
     }
 }
}


