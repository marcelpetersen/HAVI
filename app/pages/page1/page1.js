import { Page, Platform } from 'ionic/ionic';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})


export class Page1 {
    click;
    constructor() {
        // Get Cookie for Auth
        var cookie = Cookie.getCookie('user');
            if(cookie){
                this.name = cookie;
            }
    }
    
}