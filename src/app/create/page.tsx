import { redirect } from "next/navigation";

export default async function CreateListingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  if (params?.type === "trade") {
    redirect("/trade");
  } else if (params?.type === "looking_for") {
    redirect("/looking-for");
  }
  redirect("/sell");
}
