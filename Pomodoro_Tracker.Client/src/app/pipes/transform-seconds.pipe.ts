import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformSeconds'
})
export class TransformSecondsPipe implements PipeTransform {

  transform(value: number): string {
    let hours: any = Math.trunc(value / 60);
    let seconds: any = value - hours * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return hours + ':' + seconds;
  }

}
