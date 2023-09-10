import { PrismaClient } from "@prisma/client";
import { importProject } from "projects";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.deleteMany();
  const simple = await importProject("simple");
  const project = await prisma.project.create({
    data: {
      type: "simple",
      nodes: {
        createMany: {
          data: Object.entries(simple).map(([name, { schema }]) => ({
            name,
            schema,
          })),
        },
      },
    },
  });

  await prisma.workspace.create({
    data: {
      name: "Test",
      project: {
        connect: {
          type: project.type,
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
