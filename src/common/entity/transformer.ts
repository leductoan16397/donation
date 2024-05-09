import { isNumber, isNumberString } from 'class-validator';
import { convertNumberToFloat } from '../utils';

export class DecimalColumnTransformer {
  to(data: number): number {
    if (data && (isNumber(data) || isNumberString(data))) {
      const rs = convertNumberToFloat(data);
      return rs;
    }

    return data;
  }
  from(data: string | null): number | null | string {
    if (data && (isNumber(data) || isNumberString(data))) {
      const rs = convertNumberToFloat(data);
      return rs;
    }

    return data;
  }
}
