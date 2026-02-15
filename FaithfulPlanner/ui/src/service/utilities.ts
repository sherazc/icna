import {MdDate} from "./DateService";

export const formIdCreate = (keys: string[]) => keys.join('_');
export const formIdBreak = (formId: string) => formId.split('_')
export const castStringToNumber = (num?: string | undefined): number => {
    const result = !num ? 0 : +num;
    return isNaN(result) ? 0 : result;
};

export const touchString = (str?: string | undefined | null): string => str ? str : "";
export const touchNumber = (num?: number | string | undefined): number => num ? +num : 0;

export const isEqualStrings = (s1?: string, s2?: string): boolean => s1 !== undefined && s2 !== undefined && s1 === s2;
export const isEqualStringsIgnoreCase = (s1?: string, s2?: string): boolean => s1 !== undefined && s2 !== undefined && s1.toLowerCase() === s2.toLowerCase();
export const isNotBlankString = (s?: string): boolean => s !== undefined && typeof s === 'string' && s.trim().length > 0;
export const isBlankString = (s?: string): boolean => !isNotBlankString(s);

export const numberNaNToZero = (num?: number | null): number => {
    return (num && num != null) ? num : 0;
};
export const numberTo2DigitsString = (num?: number | null): string => {
    num = numberNaNToZero(num);
    if (num && num != null) {
        return num < 10 && num > -1 ? `0${num}` : num + "";
    } else {
        return "00";
    }
};
export const padLeft = (input: (number | string), length: number, padString: string = '0') => {
    if (length < 2) {
        return input;
    }
    return `${padString.repeat(length - 1)}${input}`.slice(-length);
}
export const trimToLength = (str: (string | undefined | null), length: number) => {
    if (!str) return "";
    if (str.length < length) return str;
    return str.substring(0, length);
}

export const getDateInputString = (date?: MdDate): string => {
    if (!date) {
        return "";
    }
    return trimToLength(date.isoDate, 16);
}
