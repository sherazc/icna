export const formIdCreate = (keys: string[]) => keys.join('_');
export const formIdBreak = (formId: string) => formId.split('_')
export const castStringToNumber = (num?: string | undefined): number => {
    const result = !num ? 0 : +num;
    return isNaN(result) ? 0 : result;
};

export const touchString = (str?: string | undefined | null) : string => str ? str : "";
export const touchNumber = (num?: number | undefined) : number => num ? num : 0;

export const isEqualStrings = (s1?: string, s2?: string): boolean => s1 !== undefined && s2 !== undefined && s1 === s2;
export const isEqualStringsIgnoreCase = (s1?: string, s2?: string): boolean => s1 !== undefined && s2 !== undefined && s1.toLowerCase() === s2.toLowerCase();
export const isNotBlankString = (s?: string): boolean => s !== undefined && typeof s === 'string' && s.trim().length > 0;
export const isBlankString = (s?: string): boolean => !isNotBlankString(s);
