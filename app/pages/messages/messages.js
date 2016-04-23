// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, NavController,Alert } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Pipe} from 'angular2/core';
import { Push } from 'ionic-native';

// Pipes
import { obfiPipe } from '../../pipes/obfiPipe';
import { namePipe } from '../../pipes/namePipe';
import { orderByDatePipe } from '../../pipes/orderByDatePipe';

@Page({
  templateUrl: 'build/pages/messages/messages.html',
   pipes: [[obfiPipe],[namePipe],[orderByDatePipe]]
})

export class Messages {
    static get parameters() {
        return [[NavController]];
    }
    constructor(nav) {
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL
        /*    
        var push = Push.init({
        android: {
            senderID: "12345679"
        },
        ios: {
            alert: "true",
            badge: true,
            sound: 'false'
        },
        windows: {}
        });*/

       this.show = true;
       this.cities = [];
       this.name = localStorage.getItem('user');
       this.searchCities();
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
        this.ref = new Firebase(this.firebaseUrl)
                            .child('messages')
                            .child(localStorage.getItem('city'));
        if(this.name && message){
            this.ref.push({
                name: this.name,
                text: newString.toLowerCase(),
                datetime: Firebase.ServerValue.TIMESTAMP
            });            
        }
  }
  chooseCity(e){
    localStorage.setItem('city',e);
    this.messages = observableFirebaseArray(
           new Firebase(this.firebaseUrl).child('messages').child(e).orderByChild('-datetime'));
    this.show = false;
  }
  goBack(){
      this.show =! this.show;
      localStorage.removeItem('city');
      this.searchCities();
  }
  onPageDidLeave(){
      localStorage.removeItem('city');
  }
  addCity(){
    this.error = "";
    let prompt = Alert.create({
      title: 'Add a city.',
      message: "Which city do you want to add?",
      inputs: [
        {
          name: 'city',
          placeholder: 'City'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
              var ref = new Firebase(this.firebaseUrl).child('messages').child(data.city);
              ref.once('value',snap =>{
                 if(snap.exists() === true){
                     this.error = "This city already exists.. look one more time, please.";
                 }else{
                     var ref = new Firebase(this.firebaseUrl).child('messages').child(data.city);
                     ref.push({
                         name:"10154086504918701",
                         text:"Here you go, type here what you want to ask.",
                         datetime: Firebase.ServerValue.TIMESTAMP
                    });
                    this.chooseCity(data.city);
                    this.error = "";
                 }
              });
          }
        }
      ]
    });
    this.nav.present(prompt);
  }
  searchCities(){
      this.cities = [];
       var ref = new Firebase(this.firebaseUrl).child('messages');
       ref.once('value',snap =>{
           snap.forEach(dataSnap => {
               this.cities.push(dataSnap.key());
           });
       });
  }
}


