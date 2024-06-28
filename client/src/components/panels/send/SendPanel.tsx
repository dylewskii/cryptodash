// components
import AssetTransferOptions from "./AssetTransferOptions";
import Header from "./Header";
import TotalBalance from "./TotalBalance";
import AssetList from "./AssetList";

export default function SendPanel() {
  return (
    <section className="mt-4">
      <TotalBalance />
      <AssetTransferOptions />
      <Header />
      <AssetList />
    </section>
  );
}
