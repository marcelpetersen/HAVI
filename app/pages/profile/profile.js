// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavController, NavParams, Alert } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Settings } from '../settings/settings';
import { Trip } from '../trip/trip';
import { Part } from '../trip.part/trip.part';
// Pipes
import { obfiPipe } from '../../pipes/obfiPipe';
import { namePipe } from '../../pipes/namePipe';

import { SocialSharing } from 'ionic-native';

@Page({
  templateUrl: 'build/pages/profile/profile.html',
  pipes: [[obfiPipe],[namePipe]]
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
            this.profileImg = "http://stuart-nieuwpoort.be/uploads/f88c93d6f24c95941c878002467d670d.jpeg"; 
            //localStorage.getItem('picture'); 
            this.tripFavourite();
        }else{
            this.name = localStorage.getItem('user');
            this.notMyProfile = false;
            this.profileImg = localStorage.getItem('picture');
            if(!this.profileImg){
                this.profileImg = "http://stuart-nieuwpoort.be/uploads/f88c93d6f24c95941c878002467d670d.jpeg";
            }
        }

        this.numberOfTrips();
    }
    goSettings(){
        this.nav.push(Settings);
    }
    goTrip(e){
        this.nav.push(Trip,{data:e});
    }
    heartUser(){
        this.heart =! this.heart;
    }
    changeActive(e){
        if(e === "trips"){
            this.favoUser = "";
            this.favoTrips = "active";
            this.chooseCreated();
        }else if(e === "users"){
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
                }else{
                    this.message = "Upload all the trips you made so far.";
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
                }else{
                    this.message = "Plan a trip with experiences from others.";
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
                            .child('users').child(this.user);
            ref.child('favourites_users').once("value",snapshot => {
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
       });
       var newRef = new Firebase(this.firebaseUrl).child('users').child(this.user);
       newRef.child('favourites').once("value",snapshot => {
            this.following = snapshot.numChildren(); 
            if(!this.following){
                this.following = 0;
            }
        });
        newRef.child('got_favourites').once("value",snapshot => {
            this.followers = snapshot.numChildren(); 
            if(!this.followers){
                this.followers = 0;
            }
        });
    }
    goBack(){
        this.nav.pop();
    }
    share(){
            FB.ui({
            method: 'share',
            href: 'https://havi.firebaseapp.com/',
            }, function(response){});
        //SocialSharing.share("message","subject","http://localhost:8100/","http://localhost:8100/");
    }
    delete(e){
        let confirm = Alert.create({
            title: 'Confirm delete...',
            message: 'Are you sure you want to delete this trip?',
            buttons: [
                {
                text: 'Cancel',
                role: 'destructive',
                handler: () => {
                    //console.log('Disagree clicked');
                }
                },
                {
                text: 'Delete',
                handler: () => {
                    var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(e.$$fbKey);
                    ref.remove();
                    this.nav.pop();
                    }
                }
            ]
            });
            this.nav.present(confirm);
    }
}
