import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import TeamMember from "../components/TeamMember";
import { assets } from "../assets";

const team = [
  {
    name: "Ian Sorell",
    role: "CEO",
    initials: "IS",
    image: assets.slika1,
    bio: "Enjoys adventurous travel, seeks new cultures and offbeat destinations.",
  },
  {
    name: "Maya Matt",
    role: "Founder",
    initials: "MM",
    image: assets.slika2,
    bio: "Pop music lover, seeks joy and exciting pop concerts.",
  },
  {
    name: "Alex Jensen",
    role: "CTO",
    initials: "AJ",
    image: assets.slika3,
    bio: "Bookworm, creative software developer with precision.",
  },
  {
    name: "Keira Battye",
    role: "Product Designer",
    initials: "KB",
    image: assets.slika4,
    bio: "Creative painter capturing beauty with imaginative artwork.",
  },
  {
    name: "Dominic Game",
    role: "3D Artist",
    initials: "DG",
    image: assets.slika5,
    bio: "Football enthusiast, enjoys movie nights with friends.",
  },
  {
    name: "James Vial",
    role: "Head of Front-End",
    initials: "JV",
    image: assets.slika6,
    bio: "Culinary artist, explores diverse flavors, skilled in cooking.",
  },
];

function About() {
  return (
    <div className="page about-page">
      <Navbar />
      <main>
        <section className="about-hero">
          <div className="about-hero-content">
            <h1>Meet our team members</h1>
            <p>
              We focus on the details of everything we do. All to help
              businesses around the world focus on what&apos;s most important to
              them.
            </p>
            <Button href="/contact" variant="primary">
              → Get in touch
            </Button>
          </div>
        </section>

        <section className="team-section" aria-label="Our team">
          <div className="team-grid">
            {team.map((member) => (
              <TeamMember key={member.name} {...member} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default About;
