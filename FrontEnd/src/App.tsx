import { Appbar, Filters, Store } from "./components/blocks";
import Stripe from "./components/blocks/Stripe";

export default function Home() {
  return (
    <main>
      <Appbar />
      <div className="w-full flex flex-row">
        <Filters />
        <Store />
        <Stripe/>
      </div>
    </main>
  )
}