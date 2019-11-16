import { Component, Input, OnInit } from '@angular/core';
import { FiredbService } from './../../services/firedb.service';

@Component({
  selector: 'avgtable',
  templateUrl: './avgtable.component.html',
  styleUrls: ['./avgtable.component.css']
})
export class AvgtableComponent implements OnInit {

  @Input() max:number;
  private roomsAvg = [];

  constructor( private db: FiredbService ) { } 

  ngOnInit() {
    this.db.getSum(this.max)
    .subscribe(sum => {
      this.roomsAvg = [];
      Object.keys(sum).forEach(room => {
        if (sum[room])
          this.roomsAvg.push({name: room, avg: Math.floor(sum[room] / this.max) })
      })
    })

  }

}
