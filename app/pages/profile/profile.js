// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
//import { Pipe} from 'angular2/core';
import { Settings } from '../settings/settings';
import { Trip } from '../trip/trip';


@Page({
  templateUrl: 'build/pages/profile/profile.html'
})

export class Profile {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav){
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL;
        this.name = localStorage.getItem('user');
        this.profileImg =  localStorage.getItem('picture');
        
      this.all = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name));
    
       this.numberOfTrips = 0;
       var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name);
       ref.on('value',data =>{
           this.numberOfTrips = data.numChildren();
           if(this.numberOfTrips == 0){
               this.message = "At the moment you don't have a trip";
           }
       });
    }
    goSettings(){
        this.nav.push(Settings);
    }
    goTrip(e){
        this.nav.push(Trip,{data:e});
    }
}
/*

// Doesn't work because of the async 
@Pipe({name: 'count'})
export class count {
 transform(value){
     return value;
 }
}*/