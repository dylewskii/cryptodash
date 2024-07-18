import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col pt-4 pb-2 px-6">
      <div className="border-t-2 border-black dark:border-white pb-1"></div>

      <section className="flex w-full justify-between text-left pt-4">
        <div className="flex flex-col">
          <h6 className="font-semibold">About Us</h6>
          <Link className="text-sm" to={"/terms-of-service"}>
            Terms
          </Link>
          <Link className="text-sm" to={"/privacy-policy"}>
            Privacy Policy
          </Link>
          <Link className="text-sm" to={"/disclaimer"}>
            Disclaimer
          </Link>
        </div>

        <div className="flex flex-col">
          <h6 className="font-semibold">Support</h6>
          <Link to="mailto:dashecrypt@gmail.com" className="text-sm">
            Contact Us
          </Link>
          <Link className="text-sm" to={"/faq"}>
            FAQ
          </Link>
        </div>

        <div className="flex flex-col">
          <h6 className="font-semibold">Community</h6>
          <Link className="text-sm" to={"https://x.com/"}>
            Twitter
          </Link>
          <Link to={"https://discord.com/"} className="text-sm">
            Discord
          </Link>
          <Link to={"https://instagram.com/"} className="text-sm">
            Instagram
          </Link>
        </div>
      </section>
    </footer>
  );
}
