import { Pipe, PipeTransform} from '@angular/core';
import { Firebase_const } from '../const';

@Pipe({
  name: 'namePipe'
})

export class namePipe {
  transform(value, args) {
   
    for (var index = 0; index < value.length; index++) {
      if(typeof value[index] === "object" || value[index] === false || value[index] === true){
        value[index] = "";
      }else if(value[index].indexOf("http") > -1){
        value[index] = "";
      }else if(value[index].indexOf("@") > -1){
        value[index] = "";
      }
    }
    this.newArray = [];
    for (var i = 0; i < value.length; i++) {
      if (value[i] !== undefined && value[i] !== null && value[i] !== "") {
        this.newArray.push(value[i]);
      }
    }
    return this.newArray.join();
  }
}