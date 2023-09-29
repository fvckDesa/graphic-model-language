import { prisma } from "database/client";
import Link from "next/link";

export default async function Home() {
  const workspaces = await prisma.workspace.findMany();

  return (
    <ul className="space-y-4">
      {workspaces.map(({ id, name, projectType }) => (
        <li
          key={id}
          className="border-border w-full cursor-pointer rounded border"
        >
          <Link href={`/workspaces/${id}`} className="block px-4 py-2">
            <h1>{name}</h1>
            <h3>{projectType}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
