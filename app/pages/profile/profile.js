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
import { Part } from '../trip.part/trip.part';


@Page({
  templateUrl: 'build/pages/profile/profile.html'
})

export class Profile {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params){
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL;
        this.data = params.get('data');
        this.user = localStorage.getItem('user');
        this.favoTrips = "active";
        
        if(this.data && this.data != this.user){
            this.name = this.data;
            this.notMyProfile = true; 
            //TODO: Change this picture to profile picture user
            this.profileImg = "http://stuart-nieuwpoort.be/uploads/5707639af0da4.jpeg"; 
            //localStorage.getItem('picture'); 
            this.tripFavourite();
        }else{
            this.name = localStorage.getItem('user');
            this.notMyProfile = false;
            this.profileImg = "http://stuart-nieuwpoort.be/uploads/5707639af0da4.jpeg"; 
            //this.profileImg = JSON.parse(localStorage.getItem('firebase:session::havi')).password.profileImageURL; 
        }

        this.numberOfTrips();
        
    }
    goSettings(){
        this.nav.push(Settings);
    }
    goTrip(e){
        //console.log(e);
        this.nav.push(Trip,{data:e});
    }
    heartUser(){
        this.heart =! this.heart;
    }
    changeActive(){
        if(this.favoUser === "active"){
            this.favoUser = "";
            this.favoTrips = "active";
            this.chooseCreated();
        }else{
            this.favoUser = "active";
            this.favoTrips = "";
             this.chooseCreated();
        }
    }
    onPageDidEnter(){
        this.chooseCreated();
    }
    chooseCreated(){
       if(!this.favoUser){
           this.message = "";
           this.all = [];
            var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name);
            ref.once('value', snap => {
                if(snap.val()){
                    snap.forEach(s =>{
                        this.value = s.val()
                        this.value.$$fbKey = s.key();
                        this.all.push(this.value);
                    });
                }
            });
       }else{
        if(this.notMyProfile != true){
           this.message = "";
           this.all = [];
           this.value = [];
           var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips');
            ref.once('value', snap => {
                if(snap.val()){
                    snap.forEach(s =>{
                        this.value = s.val()
                        this.value.$$fbKey = s.key();
                        this.all.push(this.value);
                    });
                }
            });
        }else{
            this.all = [];
            this.message = "This is private";
        }
       }
    }
    
    
    onPageDidLeave(){
        if(this.heart === true){
            var ref = new Firebase(this.firebaseUrl)
                    .child('users').child(this.user).child('favourites_users');
            ref.once("value", snapshot =>{
                if(snapshot.val()){
                    var entry = 0;
                    // Check if favourite
                    snapshot.forEach(childSnapshot => {
                            if(childSnapshot.val() === this.name){
                                // Do nothing, you already liked it
                                entry += 1;
                            }
                    });
                    if(entry === 0){
                        ref.push(this.name);
                    }
                }else{
                   ref.push(this.name);
                }
            });
         }else{
            var ref = new Firebase(this.firebaseUrl)
                    .child('users').child(this.user).child('favourites_users');
            ref.once("value", snapshot =>{
                if(snapshot.val()){
                    // Check if favourite
                    snapshot.forEach(childSnapshot => {
                            if(childSnapshot.val() === this.name){
                                ref.child(childSnapshot.key()).remove();
                            }
                    });
                }
            });
         }
    }
    
    tripFavourite(){
            // Favourite trip
            var ref = new Firebase(this.firebaseUrl)
                            .child('users').child(this.user).child('favourites_users');
            ref.once("value",snapshot => {
                // Check if favourite
                snapshot.forEach(childSnapshot => {
                        if(childSnapshot.val() === this.name){
                            this.heart = true;
                        };
                });
            });
    }
    numberOfTrips(){
        this.numberOfTrips = 0;
       var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name);
       ref.on('value',data =>{
           this.numberOfTrips = data.numChildren();
           if(this.numberOfTrips === 0){
               this.message = "At the moment you don't have a trip";
           }
       });
       
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