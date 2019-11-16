import { Component, OnInit, Input } from '@angular/core';
import { FiredbService } from './../../services/firedb.service';
import * as CanvasJS from '../../../../include/canvasjs.min.js';

@Component({
  selector: 'chartpie',
  templateUrl: './chartpie.component.html',
  styleUrls: ['./chartpie.component.css']
})
export class ChartpieComponent implements OnInit {

  private sum = [];
  private chart;
  @Input() name:string;
  @Input() max:number;

  constructor( private db: FiredbService ) { }

  ngAfterViewInit() {
    this.chart = new CanvasJS.Chart("chartPie_" + this.name, {
      theme: "light",
      animationEnabled: true,
      exportEnabled: true,
      title:{
        text: this.name
      },
      data: [{
        type: "pie",
        showInLegend: false,
        toolTipContent: "<b>{name}</b>: { y } minuti (#percent%)",
        indexLabel: "{name} - #percent%",
        dataPoints: []
      }]
    });
  }

  ngOnInit() {
    this.db.getSum(this.max)
    .subscribe(sum => {
      this.chart.options.data[0].dataPoints = []
      Object.keys(sum).forEach(s => {
        this.chart.options.data[0].dataPoints.push({name: s, y: sum[s] / 60})
      });
      this.chart.render();
    })
  }

}
