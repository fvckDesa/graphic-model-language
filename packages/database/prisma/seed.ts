import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const rectangleSchema: Prisma.JsonObject = {
  title: "Product",
  description: "A product in the catalog",
  type: "object",
  properties: {
    content: {
      type: "string",
    },
  },
  required: ["content"],
};

async function main() {
  const project = await prisma.project.create({
    data: {
      name: "simple",
      url: "@/projects/simple",
      nodes: {
        createMany: {
          data: [
            {
              name: "rectangle",
              schema: rectangleSchema,
            },
          ],
        },
      },
    },
  });

  await prisma.workspace.create({
    data: {
      project: {
        connect: {
          name: project.name,
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
