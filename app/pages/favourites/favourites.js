// Page:        Favourites
// Author:      Pieter-Jan Sas

import { Page, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
// Constants
import { Firebase_const } from '../../const';
// Pages
import { Trip } from '../trip/trip';
import { Profile } from '../profile/profile';
// Pipes
import { obfiPipe } from '../../pipes/obfiPipe';
import { namePipe } from '../../pipes/namePipe';

@Page({
  templateUrl: 'build/pages/favourites/favourites.html',
  pipes: [[obfiPipe],[namePipe]]
})

export class Favourites {
    static get parameters() {
        return [[NavController]];
    }
    constructor(nav){
        this.nav = nav;
        this.allFavourites = [];
        this.allUsers = [];
        
        this.firebaseUrl = Firebase_const.API_URL;
        this.name = localStorage.getItem('user');
        
        this.first = 0;
        
        this.favoTrips = "active";
        this.message = "";
    }
    onPageWillEnter(){
        this.differenceUserTrips();
    }
    goTrip(e){
        this.nav.push(Trip,{data:e});
    }
    changeActive(e){
        if(e === "trips"){
            this.message = "";
            this.favoUser = "";
            this.favoTrips = "active";
           this.differenceUserTrips();
        }else if(e === "users"){
            this.message = "";
            this.favoUser = "active";
            this.favoTrips = "";
            this.differenceUserTrips();
        }
    }
    differenceUserTrips(){
        // Search for favourite trips or user
        if(this.favoUser){
            // Users
            this.allUsers = [];   
            var ref = new Firebase(this.firebaseUrl)
                     .child('users').child(this.name).child('favourites_users');
            ref.once('value', data =>{
                if(data.val()){
                    data.forEach(user => {
                        this.user = user.val();
                            if(this.user){
                                var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild("name").startAt(this.user).endAt(this.user);
                                ref.once('value',val => {
                                    this.num = val.numChildren();
                                    this.allUsers.push({name:this.user, num: this.num});
                                });   
                            }else{
                                this.message = "You don't have favourite users.";
                            }
                        });  
                }else{
                    this.message = "You don't have favourite users.";
                }
             });
        }else{
            // Favourites
            this.allFavourites = [];   
            var ref = new Firebase(this.firebaseUrl)
                        .child('users').child(this.name).child('favourites');
                ref.once('value',data =>{
                if(data.val()){
                    data.forEach(favo => {
                        var ref = new Firebase(this.firebaseUrl)
                            .child('trips').child(favo.val().key);
                        ref.once('value', one => {
                                if(one.val()){
                                    this.num = one.numChildren();
                                    this.value = one.val();
                                    if(this.value){
                                        this.value.$$fbKey = one.key();
                                            this.allFavourites.push(this.value);
                                    }else{
                                        this.message = "You don't have favourite trips.";
                                    }
                                }else{
                                    this.message = "You don't have favourite trips.";
                                }
                            });      
                            });

                    }else{
                        this.message = "You don't have favourite trips.";
                    }
                });
            }
    }
    goProfile(e){
        this.nav.push(Profile,{data:e})
    }
}


