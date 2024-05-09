import { randomBytes, randomUUID } from 'crypto';
import * as lodash from 'lodash';
import { DEDUCT } from './constant';

export enum CharSet {
  ALPHA_NUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  NUMERIC = '0123456789',
  ALPHA_NUMERIC_SPECIAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+',
  ALPHA_SPECIAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  NUMERIC_SPECIAL = '0123456789!@#$%^&*()_+',
  SPECIAL = '!@#$%^&*()_+',
  ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+ ',
}

export const generateSalt = () => {
  return randomBytes(10).toString('hex');
};

export const genPin = () => {
  const randomInt = getRndInteger(0, 1000);

  if (randomInt < 10) {
    return '000' + randomInt;
  }

  if (randomInt < 100) {
    return '00' + randomInt;
  }
  if (randomInt < 1000) {
    return '0' + randomInt;
  }

  return randomInt + '';
};

export const getRndInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const convertNumberToFloat = (value: string | number, precision: number = 2) => {
  if (!lodash.isNumber(+value)) {
    return NaN;
  }

  const float = lodash.round(+value, precision);
  return float;
};

export function randomString(len: number, charSet?: string) {
  charSet = charSet || CharSet.ALPHA_NUMERIC;
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export function randomStringWithPrefix(prefix: string, len: number, charSet?: string) {
  return prefix + randomString(len, charSet);
}

export function genCode(): string {
  return randomUUID().replace(/-/g, '');
}

export const deductCount = ({ input, rate }: { input: number; rate?: number }) =>
  (input * (100 - (rate || DEDUCT))) / 100;
