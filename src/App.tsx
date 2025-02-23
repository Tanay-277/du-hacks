import { Appbar, Filters, Store } from "./components/blocks";

export default function Home() {
  return (
    <main>
      <Appbar />
      <div className="w-full flex flex-row">
        <Filters />
        <Store />
      </div>
    </main>
  )
}