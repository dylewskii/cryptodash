export default function FAQPage() {
  return (
    <main className="px-8 max-w-[940px] mx-auto">
      <h2 className="text-2xl text-center mb-8 uppercase underline">FAQ</h2>

      <section className="mb-8">
        <h3 className="text-xl mb-2 font-medium">1. What is Dashecrypt?</h3>
        <p>
          Dashecrypt is a cryptocurrency dashboard that allows you to track your
          crypto portfolio, view market data, and stay updated with the latest
          trends.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl mb-2 font-medium">
          2. How do I create an account?
        </h3>
        <p>
          To create an account, click on the "Sign Up" button on the homepage
          and fill in your details. You will need to verify your email to
          complete the registration process.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl mb-2 font-medium">
          3. How do I add cryptocurrencies to my portfolio?
        </h3>
        <p>
          Once you are logged in, navigate to the portfolio section, and click
          on the "Add Coin" button. Select your desired cryptocurrency and input
          the amount.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl mb-2 font-medium">
          4. Where does Dashecrypt get its data from?
        </h3>
        <p>
          All market data and cryptocurrency information on Dashecrypt are
          sourced from{" "}
          <a
            href="https://www.coingecko.com/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            CoinGecko
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl mb-2 font-medium">
          5. How often is the market data updated?
        </h3>
        <p>
          Market data on Dashecrypt is updated in real-time, providing you with
          the latest information.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl mb-2 font-medium">
          6. Can I trust the data provided on Dashecrypt?
        </h3>
        <p>
          While we source our data from reliable third-party providers like
          CoinGecko, we recommend conducting your own research before making any
          financial decisions.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl mb-2 font-medium">
          7. How do I contact support?
        </h3>
        <p>
          For support, you can reach out to us via email at{" "}
          <a href="mailto:dashecrypt@gmail.com" className="underline">
            dashecrypt@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
