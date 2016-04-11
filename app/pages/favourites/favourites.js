// Page:        Favourites
// Author:      Pieter-Jan Sas

import { Page, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Trip } from '../trip/trip';
import { Profile } from '../profile/profile';


@Page({
  templateUrl: 'build/pages/favourites/favourites.html'
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
                    data.forEach(user => {
                        this.user = user.val();
                            var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild("name").startAt(this.user).endAt(this.user);
                            ref.once('value',val => {
                                this.num = val.numChildren();
                                console.log(this.num);
                                if(this.num === 0){
                                    this.showNull = true;
                                }else{
                                    this.showNull = false;
                                }
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
                data.forEach(favo => {
                    var ref = new Firebase(this.firebaseUrl)
                        .child('trips').child(favo.val());
                    ref.once('value', one => {
                        this.num = one.numChildren();
                            if(this.num === 0){
                                this.showNullFavo = false;
                            }else{
                                this.showNullFavo = true;
                            }
                            this.value = one.val()
                            if(this.value){
                                this.value.$$fbKey = one.key();
                                this.allFavourites.push(this.value);
                            }
                        });      
                    });
                }else{
                    this.showNull = false;
                }
            });
        }
    }
    goProfile(e){
        this.nav.push(Profile,{data:e})
    }
}


