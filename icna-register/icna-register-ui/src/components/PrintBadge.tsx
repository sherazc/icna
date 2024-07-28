import React, {CSSProperties, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import styles from "./PrintBadge.module.scss";
import checkRadio from "../styles/CheckRadio.module.scss";

interface Props {
}

let regApis = registerApis();

// CONSTANTS
const PIXEL_PER_INCH = 96;

const PAGE_WIDTH_INCHES = 8.5;
const PAGE_HEIGHT_INCHES = 11;
const PAGE_PADDING_TOP_BOTTOM_INCHES = 1
const PAGE_PADDING_LEFT_RIGHT_INCHES = 0.25

const CARD_WIDTH_INCHES = 4;
const CARD_HEIGHT_INCHES = 3;

// TYPES
type BadgeStyle = {
    eventName: string;
    attendeeName: string;
    cardId: string;
    programName: string;
}

type PrintPaper = {
    pixelPerInch: number;
    pageStyle: CSSProperties;
    cardStyle: CSSProperties;
    badgeStyle: BadgeStyle;
}

// UTILITIES
const inchToPixel = (inch: number) => `${PIXEL_PER_INCH * inch}px`;
const pixelToInch = (pixel: string) => {
    const pixes = pixel.split("px");
    if (pixes.length < 2 || !isNaN(+pixes[0])) {
        return 0;
    }
    return roundTo2Decimal(+pixes[0] / PIXEL_PER_INCH);
}

const roundTo2Decimal = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

// DEFAULTS
const defaultPageStyle = (): CSSProperties => ({
    width: inchToPixel(PAGE_WIDTH_INCHES),
    height: inchToPixel(PAGE_HEIGHT_INCHES),
    paddingTop: inchToPixel(PAGE_PADDING_TOP_BOTTOM_INCHES),
    paddingBottom: inchToPixel(PAGE_PADDING_TOP_BOTTOM_INCHES),
    paddingLeft: inchToPixel(PAGE_PADDING_LEFT_RIGHT_INCHES),
    paddingRight: inchToPixel(PAGE_PADDING_LEFT_RIGHT_INCHES),
});

const defaultCardStyle = (): CSSProperties => ({
    width: inchToPixel(CARD_WIDTH_INCHES),
    height: inchToPixel(CARD_HEIGHT_INCHES),
});

const defaultBadgeStyle = (): BadgeStyle => ({
    eventName: "1.5rem",
    attendeeName: "2rem",
    cardId: ".7rem",
    programName: "1rem",
});

const defaultPrintPaper = (): PrintPaper => ({
    pixelPerInch: PIXEL_PER_INCH,
    pageStyle: defaultPageStyle(),
    cardStyle: defaultCardStyle(),
    badgeStyle: defaultBadgeStyle(),
});

// COMPONENT
export const PrintBadge: React.FC<Props> = () => {
    const {eventId, registrationId, attendeeId} = useParams();
    const [event, setEvent] = useState<EventDto>(defaultEventDto());
    const [attendees, setAttendees] = useState<AttendeeDto[]>([]);

    const [showMenu, setShowMenu] = useState<boolean>(false);

    const [printPaper, setPrintPaper] = useState<PrintPaper>(defaultPrintPaper());


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
        <div key={attendee.id} className={styles.card} style={printPaper.cardStyle}>
            <div className={styles.cardBorderOuter}>
                <div className={styles.cardBorderOuter}>
                    <div style={{
                        fontSize: printPaper.badgeStyle.eventName
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
                        fontSize: printPaper.badgeStyle.attendeeName
                    }}>
                        {attendee.firstName} {attendee.lastName}
                    </div>
                    <div style={{
                        fontSize: printPaper.badgeStyle.cardId
                    }}>
                        {event.id}-{attendee.registrationId}-{attendee.id}
                    </div>
                    {attendee.eventPrograms && attendee.eventPrograms.map(p => (
                        <div key={p.id} style={{
                            fontSize: printPaper.badgeStyle.programName
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
            <div className={styles.page} style={printPaper.pageStyle} onClick={() => setShowMenu(true)}>
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
                <a href="#">Reset TODO</a>
                <br/>
                <label className={checkRadio.checkContainer}>Show Highlights TODO
                    <input type="checkbox"/>
                    <span className={checkRadio.checkbox}></span>
                </label>
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
