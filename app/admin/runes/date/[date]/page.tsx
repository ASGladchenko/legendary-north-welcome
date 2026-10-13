import { notFound } from "next/navigation";

import { RuneList } from "../../rune-list";

export default async function RuneDatePage({
  params,
}: PageProps<"/admin/runes/date/[date]">) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  return <RuneList date={date} />;
}
