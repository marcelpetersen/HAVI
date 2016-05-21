// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';

//Pages & pages
import { Firebase_const } from '../../const';
import { Trip } from '../trip/trip';
import { Profile } from '../profile/profile';

// Pipes
import { obfiPipe } from '../../pipes/obfiPipe';
import { namePipe } from '../../pipes/namePipe';

@Page({
  templateUrl: 'build/pages/search/search.html',
   pipes: [[obfiPipe],[namePipe]]
})

export class Search {
  static get parameters() {
        return [[NavController]];
  }
  constructor(nav) {
      this.nav = nav;
      this.firebaseUrl = Firebase_const.API_URL;
      this.name = localStorage.getItem('user');

      this.queryLocations = [];
      this.queryUsers = [];
      this.favoTrips = "active";
      this.showButtonSearch = "here";
  } 
  searchQeury($event){
     this.showButtonSearch = "";
    if($event.which === 13) {
        // 13 === return
        this.showButtonSearch = "here";
        this.searchButton();
    }
  }
  changeActive(e){
      this.showButtonSearch = "here";
      this.message = "";
        if(e === "trips"){
            this.favoUser = "";
            this.favoTrips = "active";
            this.showButtonSearch = "";
        }else if(e === "users"){
            this.showButtonSearch = "";
            this.favoUser = "active";
            this.favoTrips = "";
        }
  }
  goTrip(e){
    this.nav.push(Trip,{data:e});
  }
  searchButton(){ 
      // Search button pressed + check which one is active, users or locations
     this.showButtonSearch = "here";
     this.message = "";
     if(this.favoTrips){
         this.searchLocations();
     }else if(this.favoUser){
         this.searchUsers();
     }
   }
  searchUsers(){
      // Search for users
      if(this.textMessage){
          this.queryUsers = [];    
          this.queryLocations = [];    
          var first = this.textMessage.toLowerCase();
          var ab = new Firebase(this.firebaseUrl).child('users')
                .orderByChild("name")
                .startAt(first)
                .endAt(first);
          var ref = new Firebase(this.firebaseUrl).child('users');
          ref.once('value', snap => {
                if(snap.val()){
                     
                    snap.forEach(data => {
                         if(data.val().name.indexOf(first) > -1){
                                //this.queryUsers.push(this.value);
                                var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild("name").startAt().endAt(this.user);
                                ref.once('value',val => {
                                    this.num = val.numChildren();
                                    this.queryUsers.push({name:data.key(), num: this.num});
                                });  
                         }
                    });
                    ab.once('value', snapshot =>{
                            if(snapshot.val()){
                                    snapshot.forEach(snapshotData =>{
                                        for(var key in this.queryLocations){
                                            if(this.queryUsers[key].datetime != snapshotData.val().datetime){
                                                this.value = snapshotData.val();
                                                this.value.$$fbKey = snapshotData.key();
                                                this.queryUsers.push(this.value);
                                            }
                                            break; 
                                        }
                                    });
                             }
                             if(this.queryUsers.length === 0){
                                  this.message = "No users found, keep searching please.";
                             }
                    });
                }
            });
      }else{
          this.message = "Please, enter a trip or a user name.";
      }
  } 

  searchLocations(){
      // Search for locations
      if(this.textMessage){
          this.queryLocations = [];    
          this.queryUsers = [];    
          var first = this.textMessage.toLowerCase();
          var ab = new Firebase(this.firebaseUrl).child('trips')
                .orderByChild("location")
                .startAt(first)
                .endAt(first);

          var ref = new Firebase(this.firebaseUrl).child('trips');
          ref.once('value', snap => {
                if(snap.val()){
                    snap.forEach(data => {
                         if(data.val().text.indexOf(first) > -1){
                                this.value = data.val();
                                this.value.$$fbKey = data.key();
                                this.queryLocations.push(this.value);
                         }
                    });
                    ab.once('value', snapshot =>{
                            if(snapshot.val()){
                                    snapshot.forEach(snapshotData =>{
                                        for(var key in this.queryLocations){
                                            if(this.queryLocations[key].datetime != snapshotData.val().datetime){
                                                this.value = snapshotData.val();
                                                this.value.$$fbKey = snapshotData.key();
                                                this.queryLocations.push(this.value);
                                            }
                                            
                                            break; 
                                        }
                                    });
                             }
                             if(this.queryLocations.length === 0){
                                 this.message = "No trips found, keep searching please.";
                             }
                    });
                }
            });
      }else{
        this.message = "Please, enter a trip or a user name.";
     }
     
  } 
  goProfile(e){
    this.nav.push(Profile,{data:e})
  } 
}


