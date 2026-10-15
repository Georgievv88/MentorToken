import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="page contact-page">
      <Navbar />
      <main>
        <section className="contact-section">
          <div className="contact-content">
            <h1>Let&apos;s Talk!</h1>
            <p>
              We&apos;re thrilled to connect with you! Whether you have a
              question, need assistance, or want to discuss a potential
              project, we&apos;re here to listen and help. At Mentor Token, we
              believe in the power of collaboration and are committed to
              providing you with the best support and solutions. Fill out the
              form below, and one of our team members will get back to you as
              soon as possible.
              <strong> Let&apos;s create something amazing together!</strong>
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-fields-row">
                <label>
                  <span>Full Name</span>
                  <input type="text" name="name" placeholder="Full Name" required />
                </label>
                <label>
                  <span>Email address</span>
                  <input type="email" name="email" placeholder="Email address" required />
                </label>
              </div>

              <label className="message-field">
                <span>Your message</span>
                <textarea name="message" placeholder="Your message" required />
              </label>

              <button type="submit" className="contact-submit">
                Send message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
