import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'numCompact', standalone: true })
export class NumberCompactPipe implements PipeTransform {
    transform(value: number | null | undefined): string {
        if (value == null) return '0';
        return new Intl.NumberFormat(undefined, { notation: 'compact' }).format(value);
    }
}