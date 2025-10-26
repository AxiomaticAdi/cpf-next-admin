import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <div className="text-2xl font-bold">CPF - Admin Actions</div>
      <div className="flex flex-col items-center justify-center pt-10 gap-2">
        <Button asChild className="min-w-48">
          <Link href="/create-event">Create Event</Link>
        </Button>
        <Button asChild className="min-w-48">
          <Link href="/modify-event">Modify Event</Link>
        </Button>
        <Button asChild className="min-w-48">
          <Link href="/delete-event">Delete Event</Link>
        </Button>
        <Button asChild className="min-w-48">
          <Link href="/view-all-events">View All Events</Link>
        </Button>
      </div>
    </div>
  );
}
