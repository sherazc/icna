import React, {CSSProperties, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import styles from "./PrintBadge.module.scss";

interface Props {
}

let regApis = registerApis();

// CONSTANTS
const pixelPerInch = 96;

const pageWidthInches = 8.5;
const pageHeightInches = 11;
const pagePaddingTopBottom = 1
const pagePaddingLeftRight = 0.25

const cardWidthInches = 4;
const cardHeightInches = 3;

// UTILITIES
const inchToPixel = (inch: number) => `${pixelPerInch * inch}px`;
const pixelToInch = (pixel: string) => {
    const pixes = pixel.split("px");
    if (pixes.length < 2 || !isNaN(+pixes[0])) {
        return 0;
    }
    return roundTo2Decimal(+pixes[0] / pixelPerInch);
}

const roundTo2Decimal = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

// DEFAULTS
const defaultPageStyle = (): CSSProperties => ({
    width: inchToPixel(pageWidthInches),
    height: inchToPixel(pageHeightInches),
    paddingTop: inchToPixel(pagePaddingTopBottom),
    paddingBottom: inchToPixel(pagePaddingTopBottom),
    paddingLeft: inchToPixel(pagePaddingLeftRight),
    paddingRight: inchToPixel(pagePaddingLeftRight),
});

const defaultCardStyle = (): CSSProperties => ({
    width: inchToPixel(cardWidthInches),
    height: inchToPixel(cardHeightInches),
});

const defaultBadgeStyle = (): BadgeStyle => ({
    eventName: "1.5rem",
    attendeeName: "2rem",
    cardId: ".7rem",
    programName: "1rem",
});

// TYPES
type BadgeStyle = {
    eventName: string;
    attendeeName: string;
    cardId: string;
    programName: string;
}


// COMPONENT
export const PrintBadge: React.FC<Props> = () => {
    const {eventId, registrationId, attendeeId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);
    const [pageStyle, setPageStyle] = useState<CSSProperties>(defaultPageStyle());
    const [cardStyle, setCardStyle] = useState<CSSProperties>(defaultCardStyle());
    const [nameBadgeStyle, setNameBadgeStyle] = useState<BadgeStyle>(defaultBadgeStyle());
    const [showMenu, setShowMenu] = useState<boolean>(false);


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
                        fontSize: nameBadgeStyle.eventName
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
                        fontWeight: "bold",
                        fontSize: "1rem"
                    }}>
                        LOGO
                    </div>
                    <div style={{
                        fontSize: nameBadgeStyle.attendeeName
                    }}>
                        {attendee.firstName} {attendee.lastName}
                    </div>
                    <div style={{
                        fontSize: nameBadgeStyle.cardId
                    }}>
                        {event.id}-{attendee.registrationId}-{attendee.id}
                    </div>
                    {attendee.eventPrograms && attendee.eventPrograms.map(p => (
                        <div key={p.id} style={{
                            fontSize: nameBadgeStyle.programName
                        }}>
                            {p.programName}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {/* Badges Page */}
            <div className={styles.page} style={pageStyle} onClick={() => setShowMenu(true)}>
                {attendees.map((attendee: AttendeeDto) => (createAttendeeComponent(event, attendee)))}
            </div>

            {/* Settings Menu */}
            <div className={styles.settingsMenu} style={{display: showMenu ? 'block' : 'none'}}>
                <div style={{textAlign: "right"}}>
                    <a href="#" style={{fontWeight: "bold"}} onClick={() => setShowMenu(false)}>
                        X
                    </a>
                </div>
                <div>All dimensions are in inches.</div>
                <br/>
                <label>Pixel per inch</label>
                <input type="number"/>

                <div style={{fontSize: "2rem"}}>Page</div>
                <br/>
                <label>Width</label>
                <input type="number"/>
                <label>Height</label>
                <input type="number"/>
                <br/>
                <label>Padding top & bottom</label>
                <input type="number"/>
                <br/>
                <label>Padding left & right</label>
                <input type="number"/>

                <div style={{fontSize: "2rem"}}>Card</div>
                <br/>
                <label>Width</label>
                <input type="number"/>
                <label>Height</label>
                <input type="number"/>
            </div>
        </div>
    );
};
