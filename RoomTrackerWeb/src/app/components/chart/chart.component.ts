import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as CanvasJS from '../../../../include/canvasjs.min.js';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {

  @Input() name:string;
  private chart;
  private dataPoints = [];
  private data;

  constructor( private dataService: DataService ) {
    
  }

  lastElement(array) {
    return array.slice(-1)[0]
  }

  ngOnInit() {
    this.dataService.data.forEach(room => {
      if (room.name == this.name.toLowerCase())
        this.data = room;
    });
  }
  

  ngAfterViewInit() {
    this.chart = new CanvasJS.Chart("chart_" + this.name,{
      exportEnabled: true,
      title:{
        text: this.name
      },
      data: [{
        type: "line",
        dataPoints : this.dataPoints,
        lineThickness: 3,
      }],
      axisX:{
        interval: 1,
        intervalType: "minute",
      }
    });
    this.dataPoints.push({ x: new Date(), y: this.lastElement(this.data.count)});
    this.chart.render();
    
    setInterval(() => {
      this.dataPoints.push({ x: new Date(), y: this.lastElement(this.data.count)});
      if (this.dataPoints.length > 16)
        this.dataPoints.shift();
      this.chart.render();
    },  2 * 1000);  
  }
}
