// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavParams, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Part } from '../trip.part/trip.part';


@Page({
  templateUrl: 'build/pages/trip/trip.html'
})

export class Trip {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params){
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL;
        this.user = localStorage.getItem('user');
        this.data = params.get('data');
        // Load all images when page enter
        this.pictures = observableFirebaseArray(
            new Firebase(this.firebaseUrl).child('trips').child(this.data.$$fbKey).child('pictures'));
        
        var ref = new Firebase(this.firebaseUrl)
                .child('users').child(this.user).child('favourites');
        ref.once("value",snapshot =>{
            // Check if favourite
              snapshot.forEach(childSnapshot => {
                    if(childSnapshot.val() === this.data.$$fbKey){
                        this.heart = true;
                    };
            });
        });
        

    }
    goPart(e){
        this.nav.push(Part,{data:e});
    }
    favouriteTrip(){
        var ref = new Firebase(this.firebaseUrl)
                .child('users').child(this.user).child('favourites');
        ref.once("value", snapshot =>{
            if(snapshot.val()){
                // Check if favourite
                snapshot.forEach(childSnapshot => {
                        if(childSnapshot.val() === this.data.$$fbKey){
                            console.log(childSnapshot.val());
                            ref.child(childSnapshot.key()).remove();
                            console.log(childSnapshot.val());
                            this.heart = ""; 
                        }else{
                            this.heart = "something"; 
                            ref.push(this.data.$$fbKey);
                            
                        };
                }); 
            }else{
               this.heart = "something"; 
               ref.push(this.data.$$fbKey);
               
            }

        });
    }
}