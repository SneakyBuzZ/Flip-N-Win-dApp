import "@/styles/globals.css";
import NavBar from "@/components/shared/NavBar";
import DisplayCard from "@/components/shared/DisplayCard";
import BetForm from "@/components/shared/BetForm";

function App() {
  return (
    <>
      <section className="h-screen flex flex-col items-center">
        <NavBar />
        <main className="w-full h-[92%] md:h-[91%] flex justify-center items-center">
          <DisplayCard desription="Flip the coin and win the double of your amount">
            <BetForm />
          </DisplayCard>
        </main>
      </section>
    </>
  );
}

export default App;
