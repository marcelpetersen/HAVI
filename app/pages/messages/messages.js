// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, NavController,Alert } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Pipe } from '@angular/core';
// Constants
import { Firebase_const } from '../../const';
// Pipes
import { obfiPipe } from '../../pipes/obfiPipe';
import { namePipe } from '../../pipes/namePipe';
import { orderByDatePipe } from '../../pipes/orderByDatePipe';
// Native
import { Push } from 'ionic-native';

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
        this.firebaseUrl = Firebase_const.API_URL;
        
        /*
        // Give the other a push notifications    
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
  searchCities(){
      var ref = new Firebase(this.firebaseUrl).child('messages');
      ref.once('value',snapShot=>{
          snapShot.forEach(data =>{
              if(this.cities.indexOf(data.key()) === -1){
                  this.cities.push(data.key());
              } 
          });
      });
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
    // Choose a city 
    this.error = "";
    localStorage.setItem('city',e);
    this.messages = observableFirebaseArray(
           new Firebase(this.firebaseUrl).child('messages').child(e).orderByChild('-datetime'));
    this.show = false;
  }
  goBack(){
      this.show =! this.show;
      localStorage.removeItem('city');
  }
  onPageDidLeave(){
      localStorage.removeItem('city');
  }
  addCity(){
    // If there's no city you would like to know something from, just add it..
    this.error = "";
    var prompt = Alert.create({
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
              // If city exists, go to city, otherwise.. Go to page of the city
              var ref = new Firebase(this.firebaseUrl).child('messages').child(data.city.toLowerCase());
              ref.once('value',snap =>{
                 if(snap.exists() === true){
                     this.chooseCity(data.city.toLowerCase());
                 }else{
                     var ref = new Firebase(this.firebaseUrl).child('messages').child(data.city.toLowerCase());
                     ref.push({
                         name:"10154086504918701",
                         text:"Here you go, type here what you want to ask.",
                         datetime: Firebase.ServerValue.TIMESTAMP
                    });
                    this.chooseCity(data.city.toLowerCase());
                    this.error = "";
                 }
              });
          }
        }
      ]
    });
    this.nav.present(prompt);
  }
}


