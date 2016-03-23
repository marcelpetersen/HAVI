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
import {Add} from '../add/add';
import {Favourites} from '../favourites/favourites';


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
    this.home = Home;
    this.search = Search;
    this.messages = Messages;
    this.add = Add;
    this.favourites = Favourites;

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
    this.now = false;
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
			   
    }
    

}
