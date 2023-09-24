"use client";
import { useWorkspace } from "@/contexts/workspace";
import {
  TreeView,
  SubTree,
  TreeLeaf,
  TreeVisual,
  TreeAction,
} from "./ui/tree-view";
import { Node } from "reactflow";
import {
  GenericState,
  isSubSchema,
  Schema,
  omit,
  pick,
  Property,
  SubSchema,
  State,
} from "api";
import { useSchema } from "@/contexts/project";
import {
  useMemo,
  createContext,
  useContext,
  useCallback,
  Fragment,
  memo,
} from "react";
import StateModal from "./StateModal";
import { Value, ValuePointer } from "@sinclair/typebox/value";
import { Plus, Settings2, Trash2 } from "lucide-react";
import { SubmitHandler } from "react-hook-form";
import { Button } from "./ui/button";

const MemoRootLeaf = memo(RootLeaf, (prev, next) =>
  Value.Equal(prev.node.data, next.node.data)
);

function EditorTree() {
  const { nodes } = useWorkspace();

  return (
    <TreeView>
      {nodes.map((node) => (
        <MemoRootLeaf key={node.id} node={node} />
      ))}
    </TreeView>
  );
}

export default EditorTree;

interface RootLeafContextProps {
  state: GenericState;
  create: (state: GenericState, path: string) => void;
  update: (state: GenericState, path: string) => void;
  delete: (path: string) => void;
}

const RootLeafContext = createContext<RootLeafContextProps | null>(null);

function useRootLeaf() {
  const ctx = useContext(RootLeafContext);

  if (!ctx) {
    throw new Error("'useRootLeaf' need to be wrap in a 'RootLeafProvider'");
  }

  return ctx;
}

interface RootLeafProps {
  node: Node<GenericState>;
}

function RootLeaf({ node }: RootLeafProps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const schema = useSchema(node.type!);
  const { createSubState, updateState, deleteState } = useWorkspace(
    (state) => ({
      createSubState: state.createSubState,
      updateState: state.updateState,
      deleteState: state.deleteState,
    })
  );

  const create = useCallback<RootLeafContextProps["create"]>(
    (state, path) => createSubState(node.id, state, path),
    [node.id, createSubState]
  );

  const update = useCallback<RootLeafContextProps["update"]>(
    (state, path) => updateState(node.id, state, path),
    [node.id, updateState]
  );

  const deleteFn = useCallback<RootLeafContextProps["delete"]>(
    (path) => deleteState(node.id, path),
    [node.id, deleteState]
  );

  return (
    <RootLeafContext.Provider
      value={{ state: node.data, create, update, delete: deleteFn }}
    >
      <StateLeaf schema={schema} state={node.data} path="" />
    </RootLeafContext.Provider>
  );
}

interface StateLeafProps {
  schema: Schema;
  state: GenericState;
  path: string;
}

function StateLeaf({ schema: rootSchema, path }: StateLeafProps) {
  const rootLeaf = useRootLeaf();
  const { schema, subSchemas } = useSubSchema(rootSchema);
  const { state, subStates } = useSubState(rootSchema, path);

  return (
    <TreeLeaf>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <TreeVisual className="text-sm">
        {typeof state[schema.title!] === "string"
          ? state[schema.title!]
          : schema.title}
      </TreeVisual>
      <TreeAction className="flex gap-2">
        <StateModal
          schema={schema}
          state={state}
          onSubmit={(state) => rootLeaf.update(state, path)}
        >
          <Button type="button" variant="ghost" size="sm-icon">
            <Settings2 size={16} />
          </Button>
        </StateModal>
        <Button
          onClick={() => rootLeaf.delete(path)}
          type="button"
          variant="ghost"
          size="sm-icon"
        >
          <Trash2 size={16} />
        </Button>
      </TreeAction>
      <SubTree>
        {subSchemas.map((schema) => (
          <Fragment key={schema.$id}>
            <TreeLeaf>
              <TreeVisual className="text-sm">Add {schema.$id}</TreeVisual>
              <TreeAction>
                <AddState
                  schema={schema}
                  onSubmit={(state) =>
                    rootLeaf.create(
                      { ...Value.Create(schema), ...state },
                      `${path}/${schema.$id}`
                    )
                  }
                />
              </TreeAction>
            </TreeLeaf>
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {subStates[schema.$id!].map((state, idx) => (
              <StateLeaf
                key={`${schema.$id}-${idx}`}
                schema={schema}
                state={state}
                path={`${path}/${schema.$id}/${idx}`}
              />
            ))}
          </Fragment>
        ))}
      </SubTree>
    </TreeLeaf>
  );
}

interface AddStateProps {
  schema: Schema;
  onSubmit: SubmitHandler<GenericState>;
}

function AddState({ schema: rootSchema, onSubmit }: AddStateProps) {
  const { schema } = useSubSchema(rootSchema);

  return (
    <StateModal
      schema={schema}
      state={Value.Create(schema)}
      onSubmit={onSubmit}
    >
      <Button variant="ghost" size="sm-icon">
        <Plus size={16} />
      </Button>
    </StateModal>
  );
}

function useSubSchema(rootSchema: Schema) {
  return useMemo(() => {
    const { schema, subSchemas } = Object.keys(rootSchema.properties).reduce<{
      schema: Schema;
      subSchemas: SubSchema[];
    }>(
      (acc, key) => {
        if (isSubSchema(acc.schema.properties[key])) {
          acc.subSchemas.push(
            pick(acc.schema, [key]).properties[key] as SubSchema
          );
          acc.schema = omit(acc.schema, [key]);
        }
        return acc;
      },
      {
        schema: rootSchema,
        subSchemas: [],
      }
    );

    if (
      Object.values(schema.properties).some((property) => isSubSchema(property))
    ) {
      console.debug("Schema value found: ", schema);
      throw new Error("Schema value contains subSchemas");
    }
    if (!subSchemas.every((schema) => isSubSchema(schema))) {
      console.debug("SubSchema value found: ", subSchemas);
      throw new Error("SubSchemas value not contains only subSchemas");
    }

    return {
      schema: schema as Schema<Record<string, Property>>,
      subSchemas: subSchemas.map((schema) => schema.items),
    };
  }, [rootSchema]);
}

function useSubState(schema: Schema, path: string) {
  const { state: rootState } = useRootLeaf();

  const state = useMemo(() => {
    const state = ValuePointer.Get(rootState, path);
    if (!Value.Check(schema, state)) {
      console.debug("Schema found: ", schema);
      console.debug("State found: ", state);
      throw new Error("Schema and State not match");
    }

    return state;
  }, [rootState, schema, path]);

  return useMemo(
    () =>
      Object.entries(state).reduce<{
        state: State<Schema<Record<string, Property>>>;
        subStates: Record<string, GenericState[]>;
      }>(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc.subStates[key] = value;
          } else {
            acc.state[key] = value;
          }
          return acc;
        },
        { state: {}, subStates: {} }
      ),
    [state]
  );
}
