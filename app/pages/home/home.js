

// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16
// TODO: USe ngZone for the spinner when the images are loading and there's no image
// TODO: Fix the 3 x random into 1. foreach with 3 differen variables without numbers

import { Page,Platform,NavController,NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const, StandardPicture } from '../../const';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Profile } from '../profile/profile';
import { Trip } from '../trip/trip';


@Page({
  templateUrl: 'build/pages/home/home.html'
})


export class Home {
    static get parameters() {
        return [[NavController],[NavParams]];
    }
    constructor(nav,params){
        this.platform = Platform;
        this.trips = [];
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL;
        this.standardPicture = StandardPicture.URL;
        this.showscreen = "";
        this.user = localStorage.getItem('user');
        this.images = [];
        this.lessClass = "list";
        this.extraClass = "list2";
        
        this.doPulling();
            
   }
   doPulling(refresher){
       this.loadItems();
   }
   loadItems(){
        // Load all images when page enter
        var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.user).endAt(this.user).limitToLast(3);
        ref.once("value", snap => {
           if(snap.numChildren() === 1 || snap.numChildren() === 2){
               // Do something extra
               snap.forEach(val => {
                    this.value = val.val();
                    this.value.$$fbKey = val.key();
                    this.images.push(this.value);
               });
               this.otherPictures(6);
           }else if(snap.numChildren() === 3){
               snap.forEach(val => {
                    this.value = val.val();
                    this.value.$$fbKey = val.key();
                    this.images.push(this.value);
               });
               this.otherPictures(6);
           }else{
               this.error = "Maak hier je eigen albums aan";
               this.lessClass = "list less";
               this.extraClass = "list2 extra";
               this.otherPictures(9);
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
            console.log("The read failed: " + errorObject.code);
          });
   } 
    
  takePicture() {
    this.platform.ready().then(() => {
      let options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };
      // https://github.com/apache/cordova-plugin-camera#module_camera.getPicture
      navigator.camera.getPicture(
        (data) => {
           this.img = data;
           let imagedata = "data:image/jpeg;base64," + data;
            this.firebaseUrl = Firebase_const.API_URL;
            var ref = new Firebase(this.firebaseUrl).child('trips');
            this.user = Cookie.getCookie('user');
            // Push item to firebase URL (ref)
            ref.child(this.user).push({
                src: imagedata,
                datetime: Firebase.ServerValue.TIMESTAMP
            });
        }, (error) => {
          alert(error);
        }, options
      );
    });
  }
    
    goToTrip($event){
        var ev = $event;
        if(ev){
             this.nav.push(Trip,{data:ev});
        }
       
    }
    goOwn(){
        this.now = false;
        this.nav.push(Profile);
    }
    onPageLoaded(){
        // TODO: put images in localstorage
        
    }
    imageSource(e){
       if(!e){
           return "img";
       }
    }
}

