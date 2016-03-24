// Page:        Favourites
// Author:      Pieter-Jan Sas

import { Page, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Trip } from '../trip/trip';


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
        this.firebaseUrl = Firebase_const.API_URL;
        this.name = localStorage.getItem('user');
        var ref = new Firebase(this.firebaseUrl)
                     .child('users').child(this.name).child('favourites');
        ref.once('value',data =>{
            this.all = [];
            data.forEach(favo => {
                var ref = new Firebase(this.firebaseUrl)
                     .child('trips').child(favo.val());
                ref.once('value', one => {
                    this.num = one.numChildren();
                    this.value = one.val()
                    this.value.$$fbKey = one.key();
                    this.allFavourites.push(this.value);
                });      
            });
        });
        this.first = 0;
    }
    onPageWillEnter(){
        if(this.first === 0){
            this.first += 1;
        }else{
            this.allFavourites = [];
           var ref = new Firebase(this.firebaseUrl)
                     .child('users').child(this.name).child('favourites');
            ref.once('value', numberEnter => {
                if(numberEnter.numChildren() != this.num){
                    ref.once('value',data =>{
                        this.all = [];
                        data.forEach(favo => {
                            var ref = new Firebase(this.firebaseUrl)
                                .child('trips').child(favo.val());
                            ref.once('value', one => {
                                this.num = one.numChildren();
                                this.value = one.val()
                                this.value.$$fbKey = one.key();
                                this.allFavourites.push(this.value);
                            });      
                        });
                    });
                }
            });  
        }
    }
    goTrip(e){
        this.nav.push(Trip,{data:e});
    }
}


