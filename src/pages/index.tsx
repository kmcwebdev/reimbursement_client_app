import { Button } from "~/components/core/Button";

export default function Home() {
  return (
    <section className="grid w-full place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1>Welcome!</h1>
        <h2>Welcome!</h2>
        <h3>Welcome!</h3>
        <h4>Welcome!</h4>
        <p>File your reimbursements in one place!</p>
        <Button>File a Reimbursement</Button>
      </div>
    </section>
  );
}
