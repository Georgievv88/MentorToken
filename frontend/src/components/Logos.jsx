import { assets } from "../assets";

const logos = [
  { img: assets.adobe, alt: "Adobe" },
  { img: assets.braze, alt: "Braze" },
  { img: assets.hellosign, alt: "HelloSign" },
  { img: assets.maze, alt: "Maze" },
  { img: assets.ghost, alt: "Ghost" },
  { img: assets.atlassian, alt: "Atlassian" },
  { img: assets.treehouse, alt: "Treehouse" },
  { img: assets.intercom, alt: "Intercom" },
  { img: assets.opendoor, alt: "Opendoor" },
  { img: assets.hubspot, alt: "HubSpot" },
];

function Logos() {
  return (
    <section className="trusted">
      <div className="logo-grid">
        {logos.map((logo) => (
          <img key={logo.alt} src={logo.img} alt={logo.alt} />
        ))}
      </div>

      <p>
        More than 25+ Startups around the
        <br />
        world trusted Mentor Token.
      </p>
    </section>
  );
}

export default Logos;
