import {Page,NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import { observableFirebaseArray } from 'angular2-firebase';
//import { Firebase_const } from '../../const';
// PAGES
import {Search} from '../search/search';
import {Page1} from '../page1/page1';
import {Page2} from '../page2/page2';
import {Page3} from '../page3/page3';


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
    this.tab1Root = Page2;
    this.tab2Root = Search;
    this.tab3Root = Page3;
    
    // Get name by Cookie Auth
    this.name =  navParams.get('name'); 
  }
  photo(){
    if(navigator.camera){
        // GetPicture from ngCordova
        // TODO: Ionic2 with ngCordova (Apache Cordova)
        /*
        navigator.camera.getPicture( (imageURI) => {
        var f = new Firebase("https://gsecure.firebaseio.com/photos");
            // Push item to firebase URL (ref)
            f.child(this.name).push({
                src: imageURI,
                datetime: new Date().toDateString()
            });
        }, function (err) {
            this.error = err;
        }, {});*/
    }else{
      //alert('Nog geen ondersteuning');
      this.number = "something";
    }
  }
  note(){
     this.now =! this.now;
     this.noteVisible = true;
  }
  close(){
       this.noteVisible = false;
       // Keep data from textarea
       // TODO: ...
  }
  onPageLoad(){
  }
}
