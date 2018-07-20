import * as d3 from 'd3';
import {scaleTime, scaleLinear} from 'd3-scale';
import {transition} from 'd3-transition';
import {interpolate, interpolateBasis} from 'd3-interpolate';

import { easeLinear } from 'd3-ease';
import { interval, combineLatest } from 'rxjs';
import { mergeMap, map, concatMap } from 'rxjs/operators';
import { Component, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { DeviceService } from '../devices/device';

export function createGraph() { }

@Component({
  selector: 'app-pulse-graph',
  template: ``,
  styles: [`
    :host {
      display: block;
    }
    .graph .axis .domain {
      fill: none;
      stroke: black;
  }

  .graph .group {
    fill: none;
    stroke: black;
    stroke-width: 1.5;
}
  `],
  encapsulation: ViewEncapsulation.None
})
export class PulseGraphComponent {
  @Input() devices = [];
  constructor(private elRef: ElementRef, private deviceService: DeviceService) {}


   createGraph() {
    const now = Date.now();
    const limit = 60;
    const duration = 750;
    const {height, width} = (this.elRef.nativeElement as HTMLElement).getBoundingClientRect();
    const graphSvg = d3.select(this.elRef.nativeElement)
      .append('svg')
      .attr('class', 'graph')
      .attr('width', width)
      .attr('height', height);


    const xScale = scaleTime()
    .domain([0, 200])
    .range([0, width]);

    const yScale = scaleLinear()
      .domain([0, 250])
      .range([0, height]);

    const line = d3.line()
      .curve(d3.curveLinear)
      .x((d: any, i) => {
        return xScale(i);
      })
      .y((d:any) => {
        return yScale(d.bpm);
      });

    const paths = graphSvg.append('g');

    const data = d3.range(limit).map(d => 60);

    const line1 = paths.append('path')
      .attr('class', '')
      .style('stroke-width', 2)
      .style('fill', 'none')
      .style('stroke', 'red');


    const ticks$ = interval(500);



    this.deviceService.devices$.pipe(
      mergeMap(devices => combineLatest(...devices.map(device => this.deviceService.getMeasurements(device.deviceId)))
        .pipe(map(deviceDatas => {
          return devices.reduce((devices, device, i) => {
            devices[device.deviceId] = deviceDatas[i];
            return devices;
          }, {});
        })))
    ).subscribe(((readings:any[]) => {
      console.log(readings);
    });






  }
  ngAfterViewInit() {
    this.createGraph();
  }
}


// const limit = 60 * 1;
// const duration = 750;
// let now = Date.now() - duration;

// const width = 500, height = 200;

// const groups = {
//   current: {
//     value: 0,
//     color: 'orange',
//     data: d3.range(limit).map(function () {
//       return 0;
//     })
//   },
//   target: {
//     value: 0,
//     color: 'green',
//     data: d3.range(limit).map(function () {
//       return 0;
//     })
//   },
//   output: {
//     value: 0,
//     color: 'grey',
//     data: d3.range(limit).map(function () {
//       return 0;
//     })
//   }
// };

// // const x = scaleTime()
// //   .domain([now - (limit - 2), now - duration])
// //   .range([0, width]);

// // const y = scaleLinear()
// //   .domain([0, 100])
// //   .range([height, 0]);

// // const line = interpolate('basis', d3.line()
// //   .x(function (d, i) {
// //     return x(now - (limit - 1 - i) * duration);
// //   })
// //   .y(function (d) {
// //     return y(d);
// //   }));

// // const svg = d3.select('.graph').append('svg')
// //   .attr('class', 'chart')
// //   .attr('width', width)
// //   .attr('height', height + 50);

// // // const axis = svg.append('g')
// // //   .attr('class', 'x axis')
// // //   .attr('transform', 'translate(0,' + height + ')')
// // //   .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

// // const paths = svg.append('g')

// // // tslint:disable-next-line:forin
// // for (const name in groups) {
// //   const group = groups[name];
// //   group.path = paths.append('path')
// //     .data([group.data])
// //     .attr('class', name + ' group')
// //     .style('stroke', group.color);
// // }

// // function tick() {
// //   now = Date.now()

// //   // Add new values
// //   // tslint:disable-next-line:forin
// //   for (const n in groups) {
// //     const g = groups[n]
// //     //group.data.push(group.value) // Real values arrive at irregular intervals
// //     g.data.push(20 + Math.random() * 100);
// //     g.path.attr('d', line);
// //   }

// //   // Shift domain
// //   x.domain([now - (limit - 2) * duration, now - duration]);

// //   // Slide x-axis left
// //   // axis.transition()
// //   //   .duration(duration)
// //   //   .ease('linear')
// //   //   .call(x.axis)

// //   // Slide paths left
// //   paths.attr('transform')
// //     .transition()
// //     .duration(duration)
// //     .ease(easeLinear)
// //     .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
// //     .each('end', tick)

// //   // Remove oldest data point from each group
// //   for (var name in groups) {
// //     var group = groups[name]
// //     group.data.shift()
// //   }
// // }

// // tick()
