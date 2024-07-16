export const formIdCreate = (keys: string[]) => keys.join('_');
export const formIdBreak = (formId: string) => formId.split('_')
export const castStringToNumber = (num?: string | undefined): number => {

    const result = !num ? 0 : +num;
    return isNaN(result) ? 0 : result;
};