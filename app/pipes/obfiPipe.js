import { Pipe, PipeTransform} from '@angular/core';
import { Firebase_const } from '../const';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';

@Pipe({
  name: 'obfiPipe'
})

export class obfiPipe {
  transform(value, args) {
    this.firebaseUrl = Firebase_const.API_URL;
    this.name = observableFirebaseArray(new Firebase(this.firebaseUrl).child('users').child(value));
    return this.name;
  }
}