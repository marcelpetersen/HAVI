

// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16
// TODO: USe ngZone for the spinner when the images are loading and there's no image
// TODO: Fix the 3 x random into 1. foreach with 3 differen variables without numbers

import { Page,Platform,NavController,NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
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
        this.photos = [];
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL;
        this.showscreen = "";
   this.name = localStorage.getItem('user');
   
   this.randomImages1 = {
       src:'',
       location:''
   };
   this.randomImages2 = {
       src:'',
       location:''
   };
   this.randomImages3 = {
       src:'',
       location:''
   };
    var ref = new Firebase(this.firebaseUrl).child('photos');
    ref.on("value", (snapshot) => {
                var i = 0;
                var rand = Math.floor(Math.random() * snapshot.numChildren());
                    snapshot.forEach((snapshot)=> {
                    if (i == rand && snapshot.val().name != this.name) {
                        var src = snapshot.val().src;
                        var location = snapshot.val().location;
                        this.randomImages1 = {
                            src: src,
                            location:location
                        };
                    }
                i++;
                });
                var i = 0;
                var rand = Math.floor(Math.random() * snapshot.numChildren());
                    snapshot.forEach((snapshot)=> {
                    if (i == rand && snapshot.val().name != this.name) {
                        var src = snapshot.val().src;
                        var location = snapshot.val().location;
                        this.randomImages2 = {
                            src: src,
                            location:location
                        };
                    }
                i++;
                });
                var i = 0;
                var rand = Math.floor(Math.random() * snapshot.numChildren());
                    snapshot.forEach((snapshot)=> {
                    if (i == rand && snapshot.val().name != this.name) {
                        var src = snapshot.val().src;
                        var location = snapshot.val().location;
                        this.randomImages3 = {
                            src: src,
                            location:location
                        };
                    }
                i++;
                });
           

        },  (errorObject) => {
        console.log("The read failed: " + errorObject.code);
        });
    // Load all images when page enter
    this.images = observableFirebaseArray(
            new Firebase(this.firebaseUrl).child('photos').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(3));
    console.log(this.images);        

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
            var ref = new Firebase(this.firebaseUrl).child('photos');
            this.name = Cookie.getCookie('user');
            // Push item to firebase URL (ref)
            ref.child(this.name).push({
                src: imagedata,
                datetime: Firebase.ServerValue.TIMESTAMP
            });
        }, (error) => {
          alert(error);
        }, options
      );
    });
  }
    
    validatePassword(e){    
      if(e.length = 4){
            var ref = new Firebase(this.firebaseUrl);
            ref.once("value", (snapshot)=> {
            // The callback function will get called twice, once for "fred" and once for "barney"
            snapshot.forEach((childSnapshot)=> {
                // key will be "fred" the first time and "barney" the second time
                var key = childSnapshot.key();
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                if(childData.name){
                    console.log("you're through");
                      this.showscreen = "magweg";
                }
            });
            });
      }
    }
    /*
    doThis(e,x){
    if(x.address){
     alert(x.address);
    }else{
        EXIF.getData(e.target, ()=> {
			//console.dir(EXIF.getAllTags(img));
			var lon = EXIF.getTag(e.target,"GPSLongitude");
			var lat = EXIF.getTag(e.target,"GPSLatitude");
			if(!lon || !lat) {
				console.log("Unfortunately, I can't find GPS info for the picture");
                
                this.firebaseUrl = Firebase_const.API_URL;
                this.name = Cookie.getCookie('user');
                var ref = new Firebase(this.firebaseUrl).child('photos').child(this.name);
               
                // Get the same address as the previous picture
                // TODO: Watch the time between the two pictures and then set the address to the same address
                ref.on("value", (snapshot) => {
                var property, amount = 0;
                for ( property in  snapshot.val() ) {
                    amount ++;
                    if(property == x.$$fbKey){
                        amount -= 2;
                        var obj = Object.keys(snapshot.val())[amount];
                        ref.child(obj).on("value",(data)=>{
                            var previousAddress = data.val().address
                                ref.child(x.$$fbKey).update({
                                    src     : x.src,
                                    datetime: x.datetime,
                                    address : previousAddress
                                });
                        })
                    }
                }
                
                },  (errorObject) => {
                console.log("The read failed: " + errorObject.code);
                });
                
                
                
                return;
			}
            //utility funct based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
            var convertDegToDec = (arr) => {
                return (arr[0].numerator + arr[1].numerator/60 + (arr[2].numerator/arr[2].denominator)/3600).toFixed(4);
            };
            
            lon = convertDegToDec(lon);
            lat = convertDegToDec(lat);
            //handle W/S
            if(EXIF.getTag(this,"GPSLongitudeRef") === "W") lon = -1 * lon;
            if(EXIF.getTag(this,"GPSLatitudeRef") === "S") lat = -1 * lat;
            
            
           var geocoder = new google.maps.Geocoder();
           let latlng = new google.maps.LatLng(lat, lon);
            geocoder.geocode({'location': latlng}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                        this.firebaseUrl = Firebase_const.API_URL;
                         this.name = Cookie.getCookie('user');
                        var ref = new Firebase(this.firebaseUrl).child('photos').child(this.name).child(x.$$fbKey);
                        ref.update({
                            src     : x.src,
                            datetime: x.datetime,
                            address : results[0].formatted_address
                        });
                } else {
                    window.alert('No results found');
                }
                } else {
                  window.alert('Geocoder failed due to: ' + status);
                }
            });
            
        });			
    }       
    }*/
    goToTrip($event){
        var ev = $event;
        this.nav.push(Trip,{data:ev});
    }
    goOwn(){
        this.now = false;
        this.nav.push(Profile);
    }
    onPageLoaded(){
        // TODO: put images in localstorage
    }
    onPageWillEnter(){
        if(Cookie.getCookie('images')){
            //console.log(JSON.parse(Cookie.getCookie('images')));
        }
    }
}

