import { Component, OnInit, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'realtimeplanimetry',
  templateUrl: './realtimeplanimetry.component.html',
  styleUrls: ['./realtimeplanimetry.component.css']
})
export class RealtimeplanimetryComponent implements OnInit {
  
  private ctx;
  private canvas;
  private img;
  private data;

  constructor( private _elementRef: ElementRef, private dataService: DataService ) {
    this.data = this.dataService.data;
  }

  ngOnInit() {
    this.initCanvas();
  }

  initCanvas() {
    this.img = this._elementRef.nativeElement.querySelector("#scream");
    this.canvas = this._elementRef.nativeElement.querySelector(`#planimetry`);
    this.ctx = this.canvas.getContext('2d');
    this.redraw();

    setInterval(() => this.redraw(), 1500);
  }

  lastElement(array) {
    return array.slice(-1)[0]
  }

  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, 0, -120);

    this.ctx.font = "30px Arial";

    //Atrio
    this.ctx.fillText("Atrio: " + this.lastElement(this.data[0].count), 150, 405);

    //Expo
    this.ctx.fillText("Expo: " + this.lastElement(this.data[3].count), 150, 505);

    //Sala carroponte dietro
    this.ctx.fillText("Carroponte: " + this.lastElement(this.data[1].count), 350, 280);

    //Sala carroponte palco
    this.ctx.fillText("Palco: " + this.lastElement(this.data[2].count), 750, 280);
  }

}
