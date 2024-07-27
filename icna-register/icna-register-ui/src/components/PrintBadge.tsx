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

const defaultPageStyle: CSSProperties = {
    width: inchToPixel(pageWidthInches),
    height: inchToPixel(pageHeightInches),
    paddingTop: inchToPixel(pagePaddingTopBottom),
    paddingBottom: inchToPixel(pagePaddingTopBottom),
    paddingLeft: inchToPixel(pagePaddingLeftRight),
    paddingRight: inchToPixel(pagePaddingLeftRight),
}

const defaultCardStyle: CSSProperties = {
    width: inchToPixel(cardWidthInches),
    height: inchToPixel(cardHeightInches),
}

type CardTextSize = {
    eventName: string;
    attendeeName: string;
    cardId: string;
    programName: string;
}

const defaultCardTextSize: CardTextSize = {
    eventName: "1.5rem",
    attendeeName: "2rem",
    cardId: ".7rem",
    programName: "1rem",
}


export const PrintBadge: React.FC<Props> = () => {
    const {eventId, registrationId, attendeeId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);
    const [pageStyle, setPageStyle] = useState<CSSProperties>(defaultPageStyle);
    const [cardStyle, setCardStyle] = useState<CSSProperties>(defaultCardStyle);
    const [cardTextSize, setCardTextSize] = useState<CardTextSize>(defaultCardTextSize);

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
        <div key={attendee.id} className={styles.card} style={cardStyle}>
            <div className={styles.cardBorderOuter}>
                <div className={styles.cardBorderOuter}>
                    <div style={{
                        fontSize: cardTextSize.eventName
                    }}>
                        {event.eventName}
                    </div>
                    <div style={{
                        height: "70px",
                        width: "70px",
                        //backgroundColor: "red",
                        margin: "0 auto",
                        alignContent: "center",
                        borderRadius: "50%",
                        border: "2px solid black",
                        boxSizing: "border-box",
                        padding: "10px",
                        fontWeight: "bold"
                    }}>
                        LOGO
                    </div>
                    <div style={{
                        fontSize: cardTextSize.attendeeName
                    }}>
                        {attendee.firstName} {attendee.lastName}
                    </div>
                    <div  style={{
                        fontSize: cardTextSize.cardId
                    }}>
                        {event.id}-{attendee.registrationId}-{attendee.id}
                    </div>
                    {attendee.eventPrograms && attendee.eventPrograms.map(p => (
                        <div key={p.id} style={{
                            fontSize: cardTextSize.programName
                        }}>
                            {p.programName}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.page} style={pageStyle}>
            {attendees.map((attendee: AttendeeDto) => (createAttendeeComponent(event, attendee)))}
        </div>
    );
};
