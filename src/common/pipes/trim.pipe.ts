import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any): any {
    // Si el valor es un string, lo recorta; si es un objeto, recorre sus propiedades.
    if (typeof value === 'string') {
      return value.trim();
    } else if (typeof value === 'object' && value !== null) {
      const trimmedObj: { [key: string]: any } = {};
      const valueObj = value as { [key: string]: any };
      for (const key in valueObj) {
        if (typeof valueObj[key] === 'string') {
          trimmedObj[key] = valueObj[key].trim();
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          trimmedObj[key] = valueObj[key];
        }
      }
      return trimmedObj;
    }
    return value;
  }
}
