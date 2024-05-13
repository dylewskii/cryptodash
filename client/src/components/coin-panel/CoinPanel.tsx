import { useParams } from "react-router-dom";

export default function CoinPanel() {
  const { coinName } = useParams();
  return (
    <div>
      <h1>{coinName} page</h1>
    </div>
  );
}
