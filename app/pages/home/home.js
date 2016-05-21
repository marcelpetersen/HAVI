// Page:        Photo wall connecting with Firebase
// Author:      Pieter-Jan Sas
// Last update: 29/04/16

import { Page,Platform, NavController, NavParams, Slides} from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
// Pages & Constants
import { Firebase_const, StandardPicture } from '../../const';
import { Profile }  from '../profile/profile';
import { Trip }     from '../trip/trip';
import { Add }      from '../add/add';


@Page({
  templateUrl: 'build/pages/home/home.html'
})

export class Home {
    //@ViewChild('mySlider') slides;
    static get parameters() {
        return [[NavController],[NavParams]];
    }
    
    constructor(nav,params,slides){
        this.nav = nav;
        this.platform = Platform;
        
        this.trips = [];
        this.images = [];

        this.firebaseUrl = Firebase_const.API_URL;
        this.standardPicture = StandardPicture.URL;
        this.user = localStorage.getItem('user');
        this.userName = localStorage.getItem('name');
        
        this.showscreen = "";
        this.lessClass = "list";
        this.extraClass = "list2";
        this.firstTime = "true";

        // Load all items
        this.loadItems();
        
        // Check if trips are private
        var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('private');
        ref.once('value',snap =>{
            localStorage.setItem('private',snap.val());
        });

        // Check if it's first time
        
        if(!localStorage.getItem("first")){
            //  It is the first time, show slides
            this.tabBarElement = document.querySelector('ion-tabbar-section');
            this.tabBarElement.style.display = 'none';
            this.tabBarElement = document.querySelector('ion-navbar-section');
            this.tabBarElement.style.display = 'none';
            this.firstTime = "";
        }
   }
  doRefresh(refresher) {
    // Load new items
    this.loadItems();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
   loadItems(){
       if(localStorage.getItem('images')){
           this.images = JSON.parse(localStorage.getItem('images'));
           if(this.images != [] || this.images[0].name != this.user){
               this.images = [];
               this.ownPictures();
           }
           this.otherPictures(6);
       }else{
            this.ownPictures();
       }
   }
   ownPictures(){
                  this.images = [];
            // Load all images when page enter
            var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.user).endAt(this.user).limitToLast(3);
            ref.once("value", snap => {
                if(snap.numChildren() === 1 || snap.numChildren() === 2){
                    this.lessClass = "list";
                    this.extraClass = "list2";
                    this.error = "";
                    // Push in array this.images
                    snap.forEach(val => {
                        this.value = val.val();
                        this.value.$$fbKey = val.key();
                        this.images.push(this.value);
                    });
                    this.otherPictures(6);
                }else if(snap.numChildren() === 3){
                    this.lessClass = "list";
                    this.extraClass = "list2";
                    this.error = "";
                    // Push in array this.images
                    snap.forEach(val => {
                        this.value = val.val();
                        this.value.$$fbKey = val.key();
                        this.images.push(this.value);
                    });
                    this.otherPictures(6);
                }else{
                    // Show sign to make albums self..
                    this.error = "Make your own albums here...";
                    this.lessClass = "list less";
                    this.extraClass = "list2 extra";
                    this.otherPictures(9);
                }
                // If the whole doesn't have a picture yet, but the one of the pictures do...
                // Insert then the last picture in the source of the whole trip
                for(var i = 0; i < this.images.length; i ++){
                        if(!this.images[i].src){
                            this.key;
                            this.allPictures = this.images[i].pictures;
                            for(this.key in this.allPictures) {
                                var count = 0;
                                if(this.allPictures[this.key].src && count === 0){
                                    var ref = new Firebase(this.firebaseUrl).child('trips').child(this.images[i].$$fbKey);
                                    ref.update({src:this.allPictures[this.key].src});
                                    this.images[i].src = this.allPictures[this.key].src;
                                    count ++;
                                }
                            }
                    }
                }
            });
        
   }
   otherPictures(e){
        // Load other images from other users         
        var ref = new Firebase(this.firebaseUrl).child('trips');
        ref.once("value", (snapshot) => {
            this.array = [];
            var i = 1;
            var rand = Math.floor(Math.random() * snapshot.numChildren());
                snapshot.forEach((snapshot)=> {
                    if (snapshot.val().name != this.user && this.array.length < e && snapshot.val().private != true) {
                        this.value = snapshot.val()
                        this.value.$$fbKey = snapshot.key();
                        this.array.push(this.value);
                        i++;
                    }else if(this.array.length < e){
                        rand += 1;
                    }else{
                        // Do nothing more
                    }
                });
          },  (errorObject) => {
                // No other images
                // console.log(errorObject);
          });
   } 
    
  goToTrip($event){
        var ev = $event;
        if(ev){
            this.nav.push(Trip,{data:ev});
        }
  }
  goOwn(){
        this.nav.push(Profile);
  }
  toAdd(){
        this.nav.push(Add);
  }
  onSlideChanged() {
    var currentIndex = this.slider.getActiveIndex();
    console.log("Current index is", currentIndex);
  }
  closeSlides() {
        localStorage.removeItem("first");
        //  It is the first time, show slides
        this.tabBarElement = document.querySelector('ion-tabbar-section');
        this.tabBarElement.style.display = 'block';
        this.tabBarElement = document.querySelector('ion-navbar-section');
        this.tabBarElement.style.display = 'block';
        this.firstTime = "stop";
  }
  onPageLoaded(){
      setTimeout(() =>{
          localStorage.images = JSON.stringify(this.images);
      },5000);
  }
  
  // Images back to base64 so can loaded offline
  // not yet implemented
  /*
  base64(img){
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL();
         console.log(dataURL);
        callback(dataURL);
        canvas = null; 
    };
  }*/
}

