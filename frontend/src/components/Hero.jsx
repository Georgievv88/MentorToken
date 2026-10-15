import Button from "./Button";
import { assets } from "../assets";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>
          Grow your StartUp!
          <br />
          Monitoring and
          <br />
          Evaluating now is easy!
        </h1>

        <p>
          Welcome to Mentor Token, where we redefine the dynamics of start-up
          success. Our innovative platform offers a transformative approach to
          mentorship, ensuring that mentors are not just engaged but motivated
          to drive the success of the ventures they support.
        </p>

        <div className="hero-actions">
          <Button href="/startup/register" variant="primary">
            → Get Started
          </Button>

          <Button href="/contact" variant="text">
            Get in Touch
          </Button>
        </div>
      </div>

      <div className="hero-image-area">
        <img
          src={assets.laptop}
          alt="Mentor Token dashboard laptop"
          className="laptop-img"
        />
      </div>
    </section>
  );
}

export default Hero;
