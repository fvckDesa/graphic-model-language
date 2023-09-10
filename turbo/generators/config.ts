import * as fs from "fs";
import * as path from "path";
import type { PlopTypes } from "@turbo/gen";

const projectsPath = path.resolve(process.cwd(), "./projects");
const projects = fs.readdirSync(projectsPath);

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("new-node", {
    description: "Add new node to the project",
    prompts: [
      {
        type: "list",
        name: "project",
        message: "Select project",
        choices: projects,
      },
      {
        type: "input",
        name: "name",
        message: "Insert node name: ",
      },
    ],
    actions: [
      {
        type: "add",
        path: "/projects/{{project}}/nodes/{{pascalCase name}}/Node.tsx",
        templateFile: "templates/node.hbs",
      },
      {
        type: "add",
        path: "/projects/{{project}}/nodes/{{pascalCase name}}/state.ts",
        templateFile: "templates/state.hbs",
      },
    ],
  });
}
