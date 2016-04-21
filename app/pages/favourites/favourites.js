// Page:        Favourites
// Author:      Pieter-Jan Sas

import { Page, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Trip } from '../trip/trip';
import { Profile } from '../profile/profile';
import { Here } from '../../pipes/pipe';

@Page({
  templateUrl: 'build/pages/favourites/favourites.html',
  pipes: [Here]
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
        this.showNullFavo = false;
    }
    onPageDidEnter(){
        this.differenceUserTrips();
    }
    goTrip(e){
        this.nav.push(Trip,{data:e});
    }
    changeActive(){
        if(this.favoUser === "active"){
            this.favoUser = "";
            this.favoTrips = "active";
            this.differenceUserTrips();
        }else{
            this.favoUser = "active";
            this.favoTrips = "";
             this.differenceUserTrips();
        }
    }
    differenceUserTrips(){
        if(this.favoUser){
            this.allUsers = [];   
            var ref = new Firebase(this.firebaseUrl)
                     .child('users').child(this.name).child('favourites_users');
            ref.once('value', data =>{
                if(data.val()){
                    this.showNull = true;
                    data.forEach(user => {
                        this.user = user.val();
                            var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild("name").startAt(this.user).endAt(this.user);
                            ref.once('value',val => {
                                this.num = val.numChildren();
                                this.allUsers.push({name:this.user, num: this.num});
                            });
                        });  
                }else{
                    this.showNull = false;
                }
             });
        }else{
         this.allFavourites = [];   
         var ref = new Firebase(this.firebaseUrl)
                     .child('users').child(this.name).child('favourites');
            ref.once('value',data =>{
               if(data.val()){
                   this.showNullFavo = true;
                data.forEach(favo => {
                    var ref = new Firebase(this.firebaseUrl)
                        .child('trips').child(favo.val().key);
                    ref.once('value', one => {
                        this.num = one.numChildren();
                            this.value = one.val();
                            if(this.value){
                                this.value.$$fbKey = one.key();
                                this.allFavourites.push(this.value);
                            }
                        });      
                    });
                }else{
                    this.showNullFavo = false;
                }
            });
        }
    }
    goProfile(e){
        this.nav.push(Profile,{data:e})
    }
}


