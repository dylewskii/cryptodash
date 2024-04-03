export default function Dashboard() {
  return (
    <section>
      <div className="flex flex-col">
        Total Balance
        <div className="flex gap-3">
          <p className="text-5xl">
            <span>$</span>100,000
          </p>
          <p className="flex items-center text-green-500">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 15L12 9L6 15"
                stroke="rgb(34 197 94)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            10%
          </p>
        </div>
      </div>
    </section>
  );
}
