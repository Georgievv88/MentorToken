function SocialIcon({ label }) {
  return (
    <a href="#social" aria-label={label} className="team-social-link">
      {label === "Facebook" ? "f" : label === "GitHub" ? "●" : "in"}
    </a>
  );
}

function TeamMember({ name, role, bio, initials, image }) {
  return (
    <article className="team-member">
      {image ? (
        <img className="team-photo" src={image} alt={name} />
      ) : (
        <div className="team-photo team-photo-placeholder" aria-label={name}>
          {initials}
        </div>
      )}
      <h2>{name}</h2>
      <p className="team-role">{role}</p>
      <p className="team-bio">{bio}</p>
      <div className="team-socials">
        <SocialIcon label="Facebook" />
        <SocialIcon label="GitHub" />
        <SocialIcon label="LinkedIn" />
      </div>
    </article>
  );
}

export default TeamMember;
