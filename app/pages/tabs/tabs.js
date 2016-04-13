import {Page,NavParams,NavController} from 'ionic-angular';
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
    return [[NavParams],[NavController]];
  }
    
  constructor(navParams,nav) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.home = Home;
    this.favourites = Favourites;
    this.add = Add;
    this.search = Search;
    this.messages = Messages;
    
    this.nav = nav;
    
    // Picture hidden = true
    this.pictureVisible = true;
  } 
    goOwn(){
        this.nav.push(Profile);
    }
}
