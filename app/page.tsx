import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <div className="text-2xl font-bold">Admin Actions</div>
      <div className="flex flex-col items-center justify-center pt-10 gap-2">
        <Button asChild>
          <Link href="/create-event">Create Event</Link>
        </Button>
      </div>
    </div>
  );
}
