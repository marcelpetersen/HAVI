// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, NavController, NavParams, Platform, Loading } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Http,Headers,RequestOptions,HTTP_PROVIDERS } from '@angular/http';
import { EXIF } from 'exif-js';
//import { Camera, Geolocation } from 'ionic-native';

// Constant & Pages
import { Firebase_const, StandardPicture } from '../../const';
import { Trip } from '../trip/trip';


@Page({
  templateUrl: 'build/pages/add/add.html',
  providers: [HTTP_PROVIDERS]
})

export class Add {  
  static get parameters() {
    return [[NavController],[Http],[NavParams], [Platform]];
  }
  constructor(nav,http,params,platform) {
      this.nav = nav;
      this.http = http;
      this.platform = platform;
      
      this.visiblePicture = true;
      this.visibleNote = true;
      this.visibleMap = true;
      this.newalbum = true;
      this.canUpdate = false;
      
      this.albumTitle = "Give the new album a name";
      
      this.standardPicture = StandardPicture.URL;
      this.firebaseUrl = Firebase_const.API_URL;
      
      this.name = localStorage.getItem('user');
      this.private = localStorage.getItem('private');
      this.data = params.get('data');
      if(this.data){
          this.pickTrip(this.data);
      }
      
      this.coords = {
          lat:"",
          lon:""
      }
      
      // Load last 4 trips..
      this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(4));
     
      this.tabBarElement = document.querySelector('tabbar');
  }
  uploadPicture(evt){
        this.tabBarElement.style.display = 'none';
        this.visiblePicture = false;
        
        // Give a preview from the picture!
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = ((theFile) => {
                return (e) => {
                    this.previewImage = e.target.result;
                    // FIND Location with EXIF
                    this.Exif(evt.target.files[0]);
            };
        })(f);
        reader.readAsDataURL(f);
    }
    Exif(e){
            EXIF.getData(e, ()=> {
                var lon = EXIF.getTag(e,"GPSLongitude");
                var lat = EXIF.getTag(e,"GPSLatitude");
                if(!lon || !lat) {
                        // Silence by a break..
                        
                }
                //Utility function based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
                var convertDegToDec = (arr) => {
                    return (arr[0].numerator + arr[1].numerator/60 + (arr[2].numerator/arr[2].denominator)/3600).toFixed(4);
                };
                
                lon = convertDegToDec(lon);
                lat = convertDegToDec(lat);
                // Handle W/S
                if(EXIF.getTag(e,"GPSLongitudeRef") === "W") lon = -1 * lon;
                if(EXIF.getTag(e,"GPSLatitudeRef") === "S") lat = -1 * lat;
                this.coords = {
                    lat: lat,
                    lon:lon
                };
                
                // Give Google Maps the lat, long and check for address
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(lat, lon);
                geocoder.geocode({'location': latlng}, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        console.log(results);
                            if(results[5]){
                                this.locate = results[5].formatted_address;
                                
                            }else{
                                this.locate = results[0].formatted_address;
                            }
                    } else {
                        // No location found.. Silence!
                    }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            });
    }
    
    getPicture(){
            this.timerVar = "";
            this.timerVar = "busy";
            
            // Uploading dots
            this.loading = Loading.create({
                spinner: "dots",
                content: "Uploading, please wait.."
            });
            this.nav.present(this.loading);
            
            if(this.locate){
                this.visiblePicture = true;
                this.tabBarElement.style.display = 'flex';
                var data = JSON.stringify({"image":this.previewImage, "user":this.name});
                var headers = new Headers();
                headers.append('Content-Type', 'application/json');
                this.http.post('/upload.php', data ,{ headers: headers })
                .subscribe(
                    data => {
                        this.firebaseUrl = Firebase_const.API_URL;
                        this.name = localStorage.getItem('user');
                        if(!this.chosen){
                            var ref = new Firebase(this.firebaseUrl).child('trips');
                            // Push item to firebase URL (ref)
                            var newId = ref.push({
                                    name: this.name.toLowerCase(),
                                    location: this.locate.toLowerCase(),
                                    src: "http://stuart-nieuwpoort.be/uploads/" + data._body + ".jpeg", //this.previewImage
                                    datetime: Firebase.ServerValue.TIMESTAMP,
                                    sort: "roadtrip",
                                    text: this.smallText.toLowerCase(),
                                    coords: this.coords,
                                    private:this.private
                            }); 
                            this.chosen = newId;
                            if(this.chosen){
                            var ref = new Firebase(this.firebaseUrl).child('trips')
                                .child(this.chosen.path.o[1])
                                .child('pictures');
                                                        
                                // Push item to firebase URL (ref)
                                ref.push({
                                        name: this.name.toLowerCase(),
                                        location: this.locate.toLowerCase(),
                                        src: "http://stuart-nieuwpoort.be/uploads/"  + data._body + ".jpeg", //this.previewImage
                                        datetime: Firebase.ServerValue.TIMESTAMP,
                                        text: this.smallText.toLowerCase(),
                                        coords: this.coords
                                }); 
                            }
                        }else{
                            var ref = new Firebase(this.firebaseUrl).child('trips')
                                .child(this.chosen)
                                .child('pictures');
                                                    
                            // Push item to firebase URL (ref)
                            ref.push({
                                    name: this.name.toLowerCase(),
                                    location: this.locate.toLowerCase(),
                                    src: "http://stuart-nieuwpoort.be/uploads/"  + data._body + ".jpeg",
                                    text: this.smallText.toLowerCase(),
                                    datetime: Firebase.ServerValue.TIMESTAMP,
                                    coords: this.coords
                            }); 
                        }
                        this.loading.dismiss();
                        this.timerVar = "busy";
                        this.smallText = "";
                        this.locate = "";
                        this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(4));
                    },
                    err => console.log(err)
                    );
            }else{
                this.focusLocate =! this.focusLocate;
                this.loading.dismiss();
            }
    }
    cancel(){
        if(this.visiblePicture === false){
            this.previewImage = "";
            this.smallText = "";
            this.visiblePicture = true;
            
        }else if(this.visibleNote === false){
            this.longText = "";
            this.visibleNote = true;
        }else{
            this.mapLocation = "";
            this.smallText = "";
            this.visibleMap = true;
        }
        this.tabBarElement.style.display = 'flex';
        document.getElementById('preview-image').innerHTML = "";
    }
    pickTrip(e){
        // Get the pictures of the chosen trip
        this.noPictures = false;
        this.albumTitle = e.location;
        this.oldTitle = this.albumTitle;
        this.chosen = e.$$fbKey;
        this.newImages = observableFirebaseArray(
            new Firebase(this.firebaseUrl)
                .child('trips')
                .child(this.chosen)
                .child('pictures'));
                    
        this.newImages = this.newImages;
        this.newalbum = false;
    }
    newAlbum(){
        this.newalbum = true;
        this.noPictures = true;
        this.chosen = "";
        this.albumTitle = "Give the new album a name";
        this.locate = "";
    }
    addNote(){
        // Preview of the note
        this.tabBarElement.style.display = 'none';
        this.visibleNote = false;
    }
    getNote(longText, noteLocation){
        // Upload the note
        if(noteLocation != ""){
            this.firebaseUrl = Firebase_const.API_URL;
            this.name = localStorage.getItem('user');
            if(!this.chosen){
                    var ref = new Firebase(this.firebaseUrl).child('trips');
                    // Push item to firebase URL (ref)
                    var newId = ref.push({
                            name: this.name.toLowerCase(),
                            location: noteLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            sort: "roadtrip",
                            text: this.longText.toLowerCase(),
                            private:this.private
                    }); 
                    this.chosen = newId;
                    if(this.chosen){
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen.path.o[1])
                        .child('pictures');
                        // Push item to firebase URL (ref)
                        ref.push({
                                name: this.name.toLowerCase(),
                                location: noteLocation.toLowerCase(),
                                datetime: Firebase.ServerValue.TIMESTAMP,
                                text: this.longText.toLowerCase()
                        }); 
                    }
                }else{
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen)
                        .child('pictures');
                    // Push item to firebase URL (ref)
                    ref.push({
                            name: this.name.toLowerCase(),
                            location: noteLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            text: this.longText.toLowerCase()
                    }); 
                }
                this.visibleNote = true;
                this.noteLocation = "";
                this.longText = "";
                this.location = "";
        }else{
            // Locate is not good, so focus it!
            this.focusLocate =! this.focusLocate;
        }
        this.tabBarElement.style.display = 'flex';
    }  
    addLocation(){
        this.tabBarElement.style.display = 'none';
        this.visibleMap = false;
        var mapEle = document.getElementById('map');
        // Show a small map
        var map = new google.maps.Map(mapEle, {
            center: {lat: 55.676098, lng: 12.568337},
            zoom: 8
        });
        // Get location of user in preview
        Geolocation.getCurrentPosition().then((position) => {
            this.coords = position.coords;
                var map = new google.maps.Map(mapEle, {
                    center: {lat: position.coords.latitude, lng: position.coords.longitude},
                    zoom: 14
                });
                var marker = new google.maps.Marker({
                    position: {lat: position.coords.latitude, lng: position.coords.longitude},
                    map: map,
                    title: "Your location"
                });
            // You got the lat, long => make it an adress    
            var geocoder = new google.maps.Geocoder;
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        geocoder.geocode({'location': latlng}, (results, status)=> {
                            if (status === google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                if(results[6]){
                                    this.mapLocation = results[6].formatted_address;
                                }else if(results[5]){
                                    this.mapLocation = results[5].formatted_address;
                                }else{
                                    this.mapLocation = results[0].formatted_address;
                                }
                            } else {
                                // No adress find, so silence...
                            }
                            } else {
                                console.log('Geocoder failed due to: ' + status);
                            }
                        });
        },
        (error) => {
            // Can't find your location due to..
            console.log(error);
        })
    }
    getLocation(mapLocation){
        // If you got a location, push it to URL
        if(mapLocation != ""){
            this.coords = {
                lat: this.coords.latitude,
                lon: this.coords.longitude
            }
            this.firebaseUrl = Firebase_const.API_URL;
            this.name = localStorage.getItem('user');
            if(!this.chosen){
                    var ref = new Firebase(this.firebaseUrl).child('trips');
                    // Push item to firebase URL (ref)
                        var newId = ref.push({
                            name: this.name.toLowerCase(),
                            location: mapLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            sort: "roadtrip",
                            text: this.smallText.toLowerCase(),
                            coords: this.coords,
                            private:this.private
                    }); 
                    this.chosen = newId;
                    if(this.chosen){
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen.path.o[1])
                        .child('pictures');
                        // Push item to firebase URL (ref)
                        ref.push({
                                name: this.name.toLowerCase(),
                                location: mapLocation.toLowerCase(),
                                datetime: Firebase.ServerValue.TIMESTAMP,
                                text: this.smallText.toLowerCase(),
                                coords: this.coords
                        }); 
                    }
                }else{
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen)
                        .child('pictures');
                                            
                    // Push item to firebase URL (ref)"
                    ref.push({
                            name: this.name.toLowerCase(),
                            location: mapLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            text: this.smallText.toLowerCase(),
                            coords: this.coords
                    }); 
                }
                this.visibleMap = true;
                this.mapLocation = "";
                this.smallText = "";
                this.location = "";
        }else{
                this.focusLocate =! this.focusLocate;
        }
        this.tabBarElement.style.display = 'flex';
    }
    takePicture(){
        // Take native picture with camera..
        this.visiblePicture = false;
        this.platform.ready().then(() => {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation:true
        };
        // https://github.com/apache/cordova-plugin-camera#module_camera.getPicture
        Camera.getPicture(
            (data) => {
                this.previewImage = data;
                var image = document.getElementById('preview-image');
                image.src = "data:image/jpeg;base64," + data;
                
                this.smallText = data;
                //var imagedata = "data:image/jpeg;base64," + data;
                
                // Here do something with picture
                this.Exif();
            }, (error) => {
                console.log(error);
            }, options);
        });
    }
}


