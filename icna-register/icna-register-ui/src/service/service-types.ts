export type EventDto = {
    id: number;
    eventName: string;
}
export const eventDtoDefault = (): EventDto => ({id: 0, eventName: ""});