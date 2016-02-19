// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page } from 'ionic/ionic';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';

@Page({
  name : "Messaging",
  templateUrl: 'build/pages/page3/page3.html'
})

export class Page3 {
  messages: Observable<any[]>;
  cities: Observable<any[]>;
  constructor() {
       this.show = true;
       this.name = Cookie.getCookie('user');
       if(!this.name){
            this.error = "Eerst inloggen a.u.b.";
       }
       
       this.cities = observableFirebaseArray(
           new Firebase("https://gsecure.firebaseio.com/cities").limitToLast(5)).debounceTime(200);
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
    addMessage(message: string) {
        var newString = message;
        this.date = new Date;
        this.ref = new Firebase("https://gsecure.firebaseio.com/messages")
                            .child(Cookie.getCookie('city'));
        if(this.name){
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
           new Firebase("https://gsecure.firebaseio.com/messages").child(e.name).limitToLast(5)).debounceTime(200);
    this.show = false;
    
  }
  back(){
      this.show =! this.show;
      Cookie.deleteCookie('city');
  }
  onPageWillEnter(){
      
  }
}