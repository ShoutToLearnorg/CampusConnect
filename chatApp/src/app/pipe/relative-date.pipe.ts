// relative-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { differenceInDays } from 'date-fns';

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    const date = new Date(value);
    const now = new Date();
    const diffInDays = differenceInDays(date, now);

    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'tomorrow';
    } else if (diffInDays > 1 && diffInDays <= 6) {
      return `${diffInDays}d`;
    } else {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks}w`;
    }
  }
}
