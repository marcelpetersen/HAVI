// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NgZone} from 'ionic/ionic';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { observableFirebaseArray } from 'angular2-firebase';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Page({
  templateUrl: 'build/pages/page2/page2.html'
}

export class Page2 {
    zone:NgZone;
    images: Observable<any[]>;
    error: string;
    arr: Observable<any[]>
    constructor(){
       
        this.arr = [];
        this.showscreen = "";
        
        // Get name by Cookie Auth
        this.name = Cookie.getCookie('user');
        if(!this.name){
            this.error = "Eerst inloggen a.u.b.";
        }
          // Load all images when page enter
         // TODO: Loads very slow (see github pages in readerlist)
        this.images = observableFirebaseArray(
           new Firebase("https://gsecure.firebaseio.com/photos").child(this.name).limitToLast(5))
                .debounceTime(100);
   }
   
  // Take picture with Camera (Works only on native application) 
  takePhoto() {
    var geocoder = new google.maps.Geocoder;
  navigator.geolocation.getCurrentPosition(
      (position) => {
          let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                     window.alert(results[0].formatted_address);
                } else {
                    window.alert('No results found');
                }
                } else {
                  window.alert('Geocoder failed due to: ' + status);
                }
            });
      },
      (error) => {
          console.log(error);
      })
  }
  
  exif(e){
      console.log(e);
  }
  
  // Push uploaded picture in firebase 
  handleFileSelect(evt) {
    var f = evt.target.files[0];
    console.log(f);
    EXIF.getData(f, function(){
        console.log(EXIF.getTag(this,'lastModified'));
    });
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            //var data = image_result.replace("data:image/jpeg;base64,", "");
			//var decoded_data = decode64(data);
            
            var filePayload = e.target.result;
            var hash = e.target.result;


          
            var ref = new Firebase("https://gsecure.firebaseio.com/photos");
            this.name = Cookie.getCookie('user');
            // Push item to firebase URL (ref)
            ref.child(this.name).push({
                src: e.target.result,
                datetime: Firebase.ServerValue.TIMESTAMP
            });
        };
    })(f);
    reader.readAsDataURL(f);
    }
    
    focus(evt){
        var element;
        element = evt.srcElement.id;
        if(evt.srcElement.value){
            this.arr.push(evt.srcElement.value);
            switch (element) {
                case "one":
                    element = document.getElementById('two');
                    element.focus();
                    break;
                case "two":
                    element = document.getElementById('three');
                    element.focus();
                    break;
                case "three":
                    element = document.getElementById('four');
                    element.focus();
                    break;
                case "four":
                    this.validatePassword(this.arr);
                    break;
            }
        }
    }
    
    validatePassword(e){    
      if(e.length = 4){
            var ref = new Firebase("https://gsecure.firebaseio.com/user");
            ref.once("value", function(snapshot) {
            // The callback function will get called twice, once for "fred" and once for "barney"
            snapshot.forEach(function(childSnapshot) {
                // key will be "fred" the first time and "barney" the second time
                var key = childSnapshot.key();
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                if(childData.name == "Pieter Sas"){
                    console.log("you're through");
                      this.showscreen = "magweg";
                }
            });
            });
      }
    }
}


