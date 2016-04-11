import {Page,NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';

// PAGES
import { Home } from '../home/home';
import { Favourites } from '../favourites/favourites';
import { Add } from '../add/add';
import { Search } from '../search/search';
import { Messages } from '../messages/messages';


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
    this.favourites = Favourites;
    this.add = Add;
    this.search = Search;
    this.messages = Messages;
    
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

}
