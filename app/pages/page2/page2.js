// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NgZone  } from 'ionic/ionic';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { observableFirebaseArray } from 'angular2-firebase';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Page({
  templateUrl: 'build/pages/page2/page2.html',
})

export class Page2 {
    zone:NgZone;
    images: Observable<any[]>;
    error: string;
    constructor(){
        // Get name by Cookie Auth
        this.name = Cookie.getCookie('user');
        if(!this.name){
            this.error = "Eerst inloggen a.u.b.";
        }
   }
   
  // Take picture with Camera (Works only on native application) 
  takePhoto() {
    if(navigator.camera){
        // GetPicture from ngCordova
        // TODO: Ionic2 with ngCordova (Apache Cordova)
        navigator.camera.getPicture( (imageURI) => {
        var f = new Firebase("https://gsecure.firebaseio.com/photos");
            // Push item to firebase URL (ref)
            f.push({
                name: this.name,
                src: imageURI,
                datetime: new Date().toDateString()
            });
        }, function (err) {
            this.error = err;
        }, {});
    }else{
         this.error = "Niet beschikbaar in de browser";
    }
  }
  
  // Push uploaded picture in firebase 
  handleFileSelect(evt) {
    var f = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            var filePayload = e.target.result;
            var hash = e.target.result;
            var f = new Firebase("https://gsecure.firebaseio.com/photos");
            this.name = Cookie.getCookie('user');
        
            // Push item to firebase URL (ref)
            f.push({
                name: this.name,
                src: e.target.result,
                datetime: new Date().toDateString()
            });
        };
    })(f);
    reader.readAsDataURL(f);
    }
    
    // Load all images when page enter
    // TODO: Loads very slow (see github pages in readerlist)
    onPageWillEnter(){
      this.images = observableFirebaseArray(
           new Firebase("https://gsecure.firebaseio.com/photos"))
                .debounceTime(100);
    }
}


