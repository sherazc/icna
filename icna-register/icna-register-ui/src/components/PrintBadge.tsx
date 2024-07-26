import React, {CSSProperties, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import styles from "./PrintBadge.module.scss";

interface Props {
}

let regApis = registerApis();

const pixelPerInch = 96;

const pageWidthInches = 8.5;
const pageHeightInches = 11;
const pagePaddingTopBottom = 1
const pagePaddingLeftRight = 0.25

const cardWidthInches = 4;
const cardHeightInches = 3;

const inchToPixel = (inch: number) => `${pixelPerInch * inch}px`;

const defaultPrintContainerStyle: CSSProperties = {
    backgroundColor: "purple",
    width: inchToPixel(pageWidthInches),
    height: inchToPixel(pageHeightInches),
    paddingTop: inchToPixel(pagePaddingTopBottom),
    paddingBottom: inchToPixel(pagePaddingTopBottom),
    paddingLeft: inchToPixel(pagePaddingLeftRight),
    paddingRight: inchToPixel(pagePaddingLeftRight),
}

const defaultPrintItemStyle: CSSProperties = {
    backgroundColor: "green",
    width: inchToPixel(cardWidthInches),
    height: inchToPixel(cardHeightInches)
}

export const PrintBadge: React.FC<Props> = () => {
    const {eventId, registrationId, attendeeId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);
    const [printContainerStyle, setPrintContainerStyle] = useState<CSSProperties>(defaultPrintContainerStyle);
    const [printItemStyle, setPrintItemStyle] = useState<CSSProperties>(defaultPrintItemStyle);

    useEffect(() => {
        if (!eventId || !registrationId) {
            return;
        }
        loadEvents(eventId);
        loadRegistration(eventId, registrationId);
    }, [eventId, registrationId]);

    useEffect(() => {
        if (!eventId || !attendeeId) {
            return;
        }
        loadEvents(eventId);
        loadAttendee(attendeeId);
    }, [eventId, attendeeId]);


    const loadEvents = async (eventIdArg: string) => {
        setEvent(await regApis.findEventById(eventIdArg));
    }

    const loadRegistration = async (eventIdArg: string, registrationIdArg: string) => {
        const attendeeDtoArray: AttendeeDto[] = await regApis.findAttendeeByEventIdAndRegistrationId(eventIdArg, registrationIdArg);
        setAttendees(attendeeDtoArray)
    }

    const loadAttendee = async (attendeeIdArg: string) => {
        setAttendees([await regApis.findAttendeeByAttendeeId(attendeeIdArg)]);
    }

    const createAttendeeComponent = (event: EventDto, attendee: AttendeeDto) => (
        <div key={attendee.id} className={styles.printCard} style={printItemStyle}>
            <div>{event.eventName}</div>
            <div>Logo</div>
            <div>{attendee.firstName} {attendee.lastName}</div>
        </div>
    );

    return (
        <div className={styles.printPage} style={printContainerStyle}>
            {attendees.map((attendee: AttendeeDto) => (createAttendeeComponent(event, attendee)))}
        </div>
    );
};
