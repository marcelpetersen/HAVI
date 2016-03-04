import {Page,NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { EXIF } from 'exif-js';
// PAGES
import {Search} from '../search/search';
import {Page1} from '../page1/page1';
import {Home} from '../home/home';
import {Messages} from '../messages/messages';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})


export class TabsPage {
  static get parameters() {
    return [[NavParams]];
  }
    
  constructor(navParams) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = Home;
    this.tab2Root = Search;
    this.tab3Root = Messages;
    // Picture hidden = true
    this.pictureVisible = true;
  }

  getLocation(){
      // Upload picture
      
       // Take picture with Camera (Works only on native application) 
     var geocoder = new google.maps.Geocoder;
     console.log(geocoder);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                 console.log('hier');
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    geocoder.geocode({'location': latlng}, (results, status)=> {
                        console.log(results);
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
    this.now =! this.now;
  }
  getNote(){
      // Upload picture
     this.now =! this.now;
     this.noteVisible = true;
  }
  close(){
      // Upload Close
       this.noteVisible = false;
       // Keep data from textarea
       // TODO: ...
  }
  onPageLoad(){
  }
  
  uploadPicture(evt){
    this.pictureVisible = false;
    var f = evt.target.files[0];
    
    var reader = new FileReader();
    reader.onload = ((theFile) => {
            return (e) => {
                this.previewImage = e.target.result;
                
            };
    })(f);
    reader.readAsDataURL(f);
  }
  
  // Push uploaded picture in firebase 
  getPicture(e) {
      this.pictureVisible = true;
      var e = document.getElementById('preview-image');
            EXIF.getData(e, ()=> {
			//console.log(EXIF.pretty(e));
			var lon = EXIF.getTag(e,"GPSLongitude");
			var lat = EXIF.getTag(e,"GPSLatitude");
            //console.log(lat);
            //console.log(lon);
			if(!lon || !lat) {
                    this.firebaseUrl = Firebase_const.API_URL;
                    this.name = localStorage.getItem('user');
                    var ref = new Firebase(this.firebaseUrl).child('photos');
                    // Push item to firebase URL (ref)
                    ref.push({
                            name: this.name,
                            location: "",
                            src: e.src,
                            datetime: Firebase.ServerValue.TIMESTAMP
                    });
            }else{
                
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
                        this.name = localStorage.getItem('user');
                        var ref = new Firebase(this.firebaseUrl).child('photos');
                        // Push item to firebase URL (ref)
                        ref.push({
                                name: this.name,
                                location: results[0].formatted_address,
                                src: e.src,
                                datetime: Firebase.ServerValue.TIMESTAMP
                        });
                } else {
                    window.alert('No results found');
                }
                } else {
                  window.alert('Geocoder failed due to: ' + status);
                }
            });
            }
        });			   
    }
}
