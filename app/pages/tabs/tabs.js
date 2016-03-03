import {Page,NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { observableFirebaseArray } from 'angular2-firebase';
//import { Firebase_const } from '../../const';
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
    
    // Get name by Cookie Auth
    this.name =  navParams.get('name'); 
  }
  getPicture(){
    if(navigator.camera){
        // Upload picture
    }else{
      //alert('Nog geen ondersteuning');
      this.number = "something";
    }
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
}
