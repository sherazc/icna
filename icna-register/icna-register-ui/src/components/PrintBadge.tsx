import React, {CSSProperties, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AttendeeDto, defaultEventDto, EventDto} from "../service/service-types";
import {registerApis} from "../service/api/ApiRegister";
import styles from "./PrintBadge.module.scss";
import checkRadio from "../styles/CheckRadio.module.scss";
import {Property} from "csstype";

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
const inchToPixel = (inch: number, pixelPerInch: number) => pixelNumberToUnit(pixelPerInch * inch);

const pixelNumberToUnit = (num: number): string => `${num}px`;

const pixelUnitNumber = (pixelUnit: string): number => {
    const pixes = pixelUnit.split("px");
    if (pixes.length < 2 || isNaN(+pixes[0])) {
        return 0;
    }
    return +pixes[0];
}

const pixelToInch = (pixelUnit: string, pixelPerInch: number) => {
    const pixels = pixelUnitNumber(pixelUnit);
    if (pixelPerInch == 0) {
        return 0;
    }
    return roundTo2Decimal(pixels / pixelPerInch);
}

const roundTo2Decimal = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const updateCSSPropertyPpi = (cssProperties: CSSProperties, field: keyof React.CSSProperties, previousPpi: number, newPpi: number) => {
    const value = cssProperties[field];
    const inches = pixelToInch(value as string, previousPpi);
    return inchToPixel(inches, newPpi);
}

// DEFAULTS
const defaultPageStyle = (): CSSProperties => ({
    width: inchToPixel(PAGE_WIDTH_INCHES, PIXEL_PER_INCH),
    height: inchToPixel(PAGE_HEIGHT_INCHES, PIXEL_PER_INCH),
    paddingTop: inchToPixel(PAGE_PADDING_TOP_BOTTOM_INCHES, PIXEL_PER_INCH),
    paddingBottom: inchToPixel(PAGE_PADDING_TOP_BOTTOM_INCHES, PIXEL_PER_INCH),
    paddingLeft: inchToPixel(PAGE_PADDING_LEFT_RIGHT_INCHES, PIXEL_PER_INCH),
    paddingRight: inchToPixel(PAGE_PADDING_LEFT_RIGHT_INCHES, PIXEL_PER_INCH),
});

const updatePageStyle = (pageStyle: CSSProperties, previousPpi: number, newPpi: number): CSSProperties => ({
    ...pageStyle,
    width: updateCSSPropertyPpi(pageStyle, "width", previousPpi, newPpi),
    height: updateCSSPropertyPpi(pageStyle, "height", previousPpi, newPpi),
    paddingTop: updateCSSPropertyPpi(pageStyle, "paddingTop", previousPpi, newPpi),
    paddingBottom: updateCSSPropertyPpi(pageStyle, "paddingBottom", previousPpi, newPpi),
    paddingLeft: updateCSSPropertyPpi(pageStyle, "paddingLeft", previousPpi, newPpi),
    paddingRight: updateCSSPropertyPpi(pageStyle, "paddingRight", previousPpi, newPpi),
});

const defaultCardStyle = (): CSSProperties => ({
    width: inchToPixel(CARD_WIDTH_INCHES, PIXEL_PER_INCH),
    height: inchToPixel(CARD_HEIGHT_INCHES, PIXEL_PER_INCH),
});

const updateCardStyle = (cardStyle: CSSProperties, previousPpi: number, newPpi: number): CSSProperties => ({
    ...cardStyle,
    width: updateCSSPropertyPpi(cardStyle, "width", previousPpi, newPpi),
    height: updateCSSPropertyPpi(cardStyle, "height", previousPpi, newPpi)
});


const defaultBadgeStyle = (): BadgeStyle => ({
    eventName: "25px",
    attendeeName: "32px",
    cardId: "10px",
    programName: "16px",
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

    const onChangePixelPer = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPageStyle = updatePageStyle(printPaper.pageStyle, printPaper.pixelPerInch, +event.target.value);
        const newCardStyle = updateCardStyle(printPaper.cardStyle, printPaper.pixelPerInch, +event.target.value);

        const newPrintPaper = {
            ...printPaper,
            pageStyle: newPageStyle,
            cardStyle: newCardStyle,
            pixelPerInch: +event.target.value,

        }
        setPrintPaper(newPrintPaper);
    }

    const onChangePageStyle = (event: React.ChangeEvent<HTMLInputElement>, field: keyof CSSProperties) => {
        const newPageStyle = {...printPaper.pageStyle};

        // @ts-ignore
        newPageStyle[field] = inchToPixel(+event.target.value, printPaper.pixelPerInch);

        const newPrintPaper = {
            ...printPaper,
            pageStyle: newPageStyle
        }
        setPrintPaper(newPrintPaper);
    }

    const onChangeCardStyle = (event: React.ChangeEvent<HTMLInputElement>, field: keyof CSSProperties) => {
        const newCardStyle = {...printPaper.cardStyle};

        // @ts-ignore
        newCardStyle[field] = inchToPixel(+event.target.value, printPaper.pixelPerInch);

        const newPrintPaper = {
            ...printPaper,
            cardStyle: newCardStyle
        }
        setPrintPaper(newPrintPaper);
    }

    const onChangePagePaddingTopBottom = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPageStyle = {...printPaper.pageStyle,
            paddingTop: inchToPixel(+event.target.value, printPaper.pixelPerInch),
            paddingBottom: inchToPixel(+event.target.value, printPaper.pixelPerInch),
        };

        const newPrintPaper = {
            ...printPaper,
            pageStyle: newPageStyle
        }
        setPrintPaper(newPrintPaper);
    }

    const onChangePagePaddingLeftRight = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPageStyle = {...printPaper.pageStyle,
            paddingLeft: inchToPixel(+event.target.value, printPaper.pixelPerInch),
            paddingRight: inchToPixel(+event.target.value, printPaper.pixelPerInch),
        };

        const newPrintPaper = {
            ...printPaper,
            pageStyle: newPageStyle
        }
        setPrintPaper(newPrintPaper);
    }

    const onChangeBadgePixel = (event: React.ChangeEvent<HTMLInputElement>, field: keyof BadgeStyle) => {
        const newBadeStyle:BadgeStyle = {...printPaper.badgeStyle};

        newBadeStyle[field] = pixelNumberToUnit(+event.target.value);
        const newPrintPaper = {
            ...printPaper,
            badgeStyle: newBadeStyle
        }
        setPrintPaper(newPrintPaper);

    }

    return (
        <div>
            {/* Badges Page */}
            {/* TODO: Repeat this div for multiple pages.*/}
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
                <input type="number" value={printPaper.pixelPerInch} name="pixelPerInch" onChange={onChangePixelPer}/>

                <div style={{fontSize: "2rem"}}>Page</div>
                <br/>
                <label>Width</label>
                <input type="number"
                       value={pixelToInch(printPaper.pageStyle.width as string, printPaper.pixelPerInch)}
                       onChange={e => onChangePageStyle(e, "width")}/>
                <label>Height</label>
                <input type="number"
                       value={pixelToInch(printPaper.pageStyle.height as string, printPaper.pixelPerInch)}
                       onChange={e => onChangePageStyle(e, "height")}/>
                <br/>
                <label>Padding top & bottom</label>
                <input type="number"
                       value={pixelToInch(printPaper.pageStyle.paddingTop as string, printPaper.pixelPerInch)}
                       onChange={onChangePagePaddingTopBottom}/>
                <br/>
                <label>Padding left & right</label>
                <input type="number"
                       value={pixelToInch(printPaper.pageStyle.paddingLeft as string, printPaper.pixelPerInch)}
                       onChange={onChangePagePaddingLeftRight}/>

                <div style={{fontSize: "2rem"}}>Card</div>
                <br/>
                <label>Width</label>
                <input type="number"
                       value={pixelToInch(printPaper.cardStyle.width as string, printPaper.pixelPerInch)}
                       onChange={e => onChangeCardStyle(e, "width")}/>
                <label>Height</label>
                <input type="number"
                       value={pixelToInch(printPaper.cardStyle.height as string, printPaper.pixelPerInch)}
                       onChange={e => onChangeCardStyle(e, "height")}/>
                <div style={{fontSize: "2rem"}}>Badge</div>
                <br/>
                <label>Event Name Size</label>
                <input type="number"
                       value={pixelUnitNumber(printPaper.badgeStyle.eventName)}
                       onChange={e => onChangeBadgePixel(e, "eventName")}/>
                <br/>
                <label>Attendee Name Size</label>
                <input type="number"
                       value={pixelUnitNumber(printPaper.badgeStyle.attendeeName)}
                       onChange={e => onChangeBadgePixel(e, "attendeeName")}/>
                <br/>
                <label>Card ID Size</label>
                <input type="number"
                       value={pixelUnitNumber(printPaper.badgeStyle.cardId)}
                       onChange={e => onChangeBadgePixel(e, "cardId")}/>
                <br/>
                <label>Program Name Size</label>
                <input type="number"
                       value={pixelUnitNumber(printPaper.badgeStyle.programName)}
                       onChange={e => onChangeBadgePixel(e, "programName")}/>
            </div>
        </div>
    );
};
