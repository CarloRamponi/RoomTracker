import { Injectable } from '@angular/core';
import { FiredbService } from './firedb.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public data;
  public rooms = ['atrio', 'carroponte', 'palco', 'expo'];

  constructor( private db: FiredbService ) {
    this.data = this.rooms.map(room => { return {name: room, count: [ 0 ] }});
    this.data.forEach(room => {
      this.db.getPeopleInRoom(room.name)
      .subscribe(count => {
        room.count.push(count)
        if (room.length > 16)
          room.count.shift()
      })
    });
  }

  
  
}
