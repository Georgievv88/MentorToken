import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Logos from "../components/Logos";
import Features from "../components/Features";
import DashboardPreview from "../components/Dashboard";

function Home() {
  return (
    <div className="page">
      <Navbar />
      <main>
        <Hero />
        <Logos />
        <Features />
        <DashboardPreview />
      </main>
    </div>
  );
}
export default Home;
