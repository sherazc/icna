import { Link } from "react-router-dom";
import "./Index.css"

const steps = [
  { title: "Create your organization", text: "Sign up in a minute and set up your team, club, masjid, church or volunteer group." },
  { title: "Create employee groups and teams", text: "Organize your people into employee groups and teams so each one can be scheduled on its own." },
  { title: "Post the dates that need people", text: "Pick any dates on the calendar for a group or team. No fixed weekdays, no repeating pattern required." },
  { title: "Members choose what works", text: "Everyone sees the open dates for their groups and signs up for the ones they can actually make." },
  { title: "Stay on top of it", text: "See who is covering which date, spot gaps early and keep everyone informed." },
];

const features = [
  { icon: "📅", title: "Any date, any time", text: "Built for irregular schedules: one-off events, special occasions, or a few days scattered through the month." },
  { icon: "🙋", title: "Volunteers pick their slots", text: "People commit to the dates that suit them, so fewer no-shows and less chasing." },
  { icon: "👥", title: "Groups made simple", text: "Organize members into groups and manage each group's schedule separately." },
  { icon: "🔔", title: "No more guesswork", text: "A clear view of who is on for each date and which dates still need someone." },
];

const sampleDays = [
  { d: "Mon", n: 3, state: "filled" },
  { d: "Tue", n: 4, state: "" },
  { d: "Wed", n: 5, state: "open" },
  { d: "Thu", n: 6, state: "" },
  { d: "Fri", n: 7, state: "filled" },
  { d: "Sat", n: 8, state: "" },
  { d: "Sun", n: 9, state: "open" },
];

export const Index: React.FC = () => {
  return (
    <div className="landing">
      <header className="landingNav">
        <span className="landingBrand">Faithful Planner</span>
        <div className="landingNavActions">
          <Link to="/login" className="lpBtn lpBtnGhost">Log in</Link>
          <Link to="/company-registration" className="lpBtn lpBtnSolid">Sign up</Link>
        </div>
      </header>

      <section className="landingHero">
        <div className="heroBlob heroBlobA" />
        <div className="heroBlob heroBlobB" />
        <div className="heroText">
          <span className="heroBadge">Scheduling for teams without a fixed routine</span>
          <h1>Schedule people <span className="heroAccent">on the days that matter</span>, not every day.</h1>
          <p>
            Faithful Planner helps you organize volunteers, staff and members when there is no
            weekly pattern. Pick the dates you need covered, let people sign up, and see at a
            glance who is where.
          </p>
          <div className="heroActions">
            <Link to="/company-registration" className="lpBtn lpBtnSolid lpBtnLg">Get started free</Link>
            <Link to="/login" className="lpBtn lpBtnOutline lpBtnLg">I already have an account</Link>
          </div>
        </div>

        <div className="heroCard" aria-hidden="true">
          <div className="heroCardHead">
            <strong>This week</strong>
            <span>Event volunteers</span>
          </div>
          <div className="heroDays">
            {sampleDays.map(x => (
              <div key={x.d} className={`heroDay ${x.state}`}>
                <small>{x.d}</small>
                <b>{x.n}</b>
                <i>{x.state === "filled" ? "Covered" : x.state === "open" ? "Needs 2" : "No duty"}</i>
              </div>
            ))}
          </div>
          <div className="heroLegend">
            <span><em className="dot filled" />Covered</span>
            <span><em className="dot open" />Needs people</span>
            <span><em className="dot" />Nothing scheduled</span>
          </div>
        </div>
      </section>

      <section className="landingSection">
        <h2>Not every team works Monday to Friday</h2>
        <p className="sectionLead">
          Most scheduling tools assume a repeating weekly rota. Real life is different:
          events, rotations and volunteer duties land on whichever dates they land on.
          Faithful Planner is made for exactly that.
        </p>
        <div className="featureGrid">
          {features.map(f => (
            <div className="featureCard" key={f.title}>
              <span className="featureIcon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landingSection landingSectionAlt">
        <h2>How it works</h2>
        <ol className="stepList">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="stepNum">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="landingCta">
        <h2>Ready to simplify your scheduling?</h2>
        <p>Create your organization today and have your first dates posted in minutes.</p>
        <div className="heroActions ctaActions">
          <Link to="/company-registration" className="lpBtn lpBtnWhite lpBtnLg">Sign up now</Link>
          <Link to="/login" className="lpBtn lpBtnLine lpBtnLg">Log in</Link>
        </div>
      </section>

      <footer className="landingFooter">© {new Date().getFullYear()} Faithful Planner</footer>
    </div>
  );
}
