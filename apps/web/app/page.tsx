import Link from "next/link";

const workspaces = [
  {
    id: "abc",
    name: "Test",
    projectType: "simple",
  },
];

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-6 p-8">
      <h1>Select Workspace</h1>
      <ul className="w-full max-w-md">
        {workspaces.map(({ id, name, projectType }) => (
          <li key={id} className="w-full rounded border border-gray-400">
            <Link href={`/workspace/${id}`} className="block px-4 py-2">
              <h1>{name}</h1>
              <h3>{projectType}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
