import * as d3 from 'd3';
import { interval, Observable, combineLatest, BehaviorSubject, animationFrameScheduler, defer } from 'rxjs';
import { mergeMap, map, concatMap, withLatestFrom, tap, scan, buffer } from 'rxjs/operators';
import { Component, ElementRef, ViewEncapsulation, Input, NgModule } from '@angular/core';
import { DeviceService, Device } from '../devices/device';

import * as firebase from 'firebase';

const colors = ['brown', 'orange', 'green', 'yellow', 'blue'];
const people = ['calum', 'martin', 'rob', 'alicia', 'gabe'];

declare var ResizeObserver;

function elementResize$(el: HTMLElement) {
  return new Observable(sink => {
    const observer = new ResizeObserver(([entry]) => {
      sink.next(entry);
    });
    observer.observe(el);
    return () => observer.unobserve(el);
  });
}

function combineLatestObj(obj: { [key: string]: Observable<any> }) {
  const keys = Object.keys(obj);
  return combineLatest(...keys.map(key => obj[key]))
    .pipe(map(values => {
      return keys.reduce((allValues, key, i) => {
        allValues[key] = values[i];
        return allValues;
      }, {});
    }));
}

export function createGraph(devices: Observable<Device[]>) { }

@Component({
  selector: 'app-pulse-graph',
  template: ``,
  styles: [`
  :host {
    display: flex;
  }
    .line {
      fill: none;
      stroke: black;
      stroke-width: 2px;
    }

    .axis {
      font-family: sans-serif;
      fill: #d35400;
      font-size: 12pt;
    }
    .line {
      fill: none;
      stroke-width: 3px;
    }
    .axis path,
		.axis line {
		  fill: none;
      stroke: black;
      stroke-width: 1px;
    }
    .axis text {
      stroke-width: 1px;
      stroke: black;
    }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class PulseGraphComponent {
  private devices$ = new BehaviorSubject<Device[]>([]);
  @Input() set devices(devices: Device[]) {
    this.devices$.next(devices || []);
  }


  constructor(private elRef: ElementRef, private deviceService: DeviceService) { }


  createGraph() {
    // const graphSize = elementResize$(this.elRef.nativeElement);
    const now = Date.now();
    const end = now - 1000;
    const limit = 60;
    const step = 1;
    const redrawInterval = 1000;
    const { height, width } = (this.elRef.nativeElement as HTMLElement).getBoundingClientRect();

    const graphSvg = d3.select(this.elRef.nativeElement)
      .append('svg')
      .attr('class', 'pulse-graph')
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleTime()
      .domain([now, end])
      .range([0, width - 25]);

    const yScale = d3.scaleLinear()
      .domain([250, 0])
      .range([0, height - 25]);



    elementResize$(this.elRef.nativeElement).subscribe((entry: any) => {
      yScale.range([0, entry.contentRect.height - 25]);
      xScale.range([0, entry.contentRect.width - 25]);
    });
    const xAxis = d3.axisBottom(xScale);
    const axisX = graphSvg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - 25})`)
      .call(xAxis);

    const lines = graphSvg.append('path');

    const yAxis = d3.axisRight(yScale);
    const axisY = graphSvg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    const line = d3.line()
      .curve(d3.curveBasisOpen)
      .x((d: any, i) => {
        return xScale(d.timestamp);
      })
      .y((d: any) => {

        return yScale(d.bpm);
      });


    const paths = graphSvg.append('path');

    const deviceDataStreams = this.devices$.pipe(
      mergeMap((devices) => devices
        .filter(device => device.deviceId)
        .map(device => this.deviceService.getMeasurements(device.deviceId).pipe(map(measurements => [device.deviceId, measurements]))
        )
      ),
      mergeMap(device => device),
      scan((allDevices, update: [string, any[]]) => {
        const [id, data] = update;
        allDevices[id] = update;
        return allDevices;
      }, {})
    );


    const ticks$ = defer(() => {
      let frameCounter = 0;
      let start = animationFrameScheduler.now();
      return interval(redrawInterval, animationFrameScheduler)
        .pipe(
          map(() => {
            const n = animationFrameScheduler.now();
            const d = n - start;
            start = n;
            return [frameCounter++, n, d];
          }));
    });

    const activeLines = {};

    const buildFrame = ([frameId, timestamp, delay], values) => {
      const frame = [
        frameId,
        timestamp,
        delay,
        timestamp - (limit * 1000),
        values
      ];
      return frame;
    };

    const renderFrame = ([frameId, timestamp, delay, min, values]) => {
      const ids = Object.keys(values);
      xScale.domain([min, timestamp]);


      return new Observable(sink => {
        xScale.domain([min, timestamp]);
        const renderTime = Date.now();

        ids.forEach((id, index) => {
          const [ok, colorIndex] = id.split('_');
          let p = activeLines[id];
          if (!p) {
            p = graphSvg.append('path');
            activeLines[id] = p;
          }
          const [idK, data] = values[id];
          p.datum(data)
            .attr('class', 'line')
            .style('stroke', colors[parseInt(colorIndex, 10)] || 'pink')
            .attr('d', line);

          p.attr('transform', null)
            .transition()
            .duration(delay - (renderTime - timestamp))
            .ease(d3.easeLinear)
            .attr('transform', 'translate(' + xScale(timestamp - (60 * 1000)) + ')');

        });

        axisX
          .transition()
          .duration(delay - (renderTime - timestamp))
          .ease(d3.easeLinear)
          .call(xAxis as any).on('end', () => {
            sink.complete();
          });
      });
    };



    ticks$.pipe(
      withLatestFrom(deviceDataStreams, buildFrame),
      concatMap(renderFrame)
    ).subscribe(() => {

    });






  }


  ngAfterViewInit() {
    this.createGraph();
  }
}

@NgModule({
  imports: [],
  exports: [PulseGraphComponent],
  declarations: [PulseGraphComponent]
})
export class PulseGraphModule { }



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
