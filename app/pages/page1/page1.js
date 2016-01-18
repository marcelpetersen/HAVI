import {Page,Platform} from 'ionic/ionic';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})


export class Page1 {
    click;
    constructor() {
        var cookie = Cookie.getCookie('user');
            if(cookie){
                this.name = cookie;
            }
    }
    login(){
          this.angular = "Even geduld a.u.b.";        
         var ref = new Firebase("https://gsecure.firebaseio.com");
            ref.authWithOAuthPopup("facebook",function(error, authData) {
            if (error) {
                 if (error.code === "TRANSPORT_UNAVAILABLE") {
                // fall-back to browser redirects, and pick up the session
                // automatically when we come back to the origin page
                ref.authWithOAuthRedirect("facebook", function(error) { /* ... */ });
                }else{
                     console.log(error);
                }
            } else {
            remember: "sessionOnly";
            scope: "email,user_likes";
            this.name = authData.facebook.displayName;
                Cookie.setCookie('user', authData.facebook.displayName);
               location.reload();
            }
        });
                    
    }
    
}