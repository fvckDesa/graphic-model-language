import { RowType, TableState } from "./state";
import { NodeProps, Handle, Position } from "api";
import { Lock, KeyRound, Snowflake } from "lucide-react";
import { cn } from "cn";

function Table({ state }: NodeProps<TableState>) {
  return (
    <>
      <Handle type="source" id="top" position={Position.Top} />
      <Handle type="source" id="left" position={Position.Left} />
      <div className="db-h-full db-w-full db-min-w-[220px] db-cursor-pointer db-overflow-hidden db-rounded-lg db-bg-white db-font-medium db-border-2 db-border-gray-400">
        <h1 className="db-border-b-2 db-border-gray-400 db-bg-gray-200 db-p-2 db-text-center db-text-lg db-font-semibold">
          {state.name}
        </h1>
        <ul className="db-min-h-[50px] db-p-2 db-transition-all">
          {state.rows.map(({ type, name, value, nullable }, idx) => (
            <li
              key={`${name}-${idx}`}
              className="db-flex db-justify-between db-items-center"
            >
              <div className="db-flex db-gap-2 db-items-center">
                <div className="db-w-4 db-h-4">
                  <RowTypeIcon type={type} />
                </div>
                <span
                  className={cn({
                    "db-font-bold": type === RowType.PrimaryKey,
                  })}
                >
                  {name}
                </span>
              </div>
              <div className="db-opacity-50 db-ml-16">{`${value}${
                nullable ? "?" : ""
              }`}</div>
            </li>
          ))}
        </ul>
      </div>
      <Handle type="source" id="bottom" position={Position.Bottom} />
      <Handle type="source" id="right" position={Position.Right} />
    </>
  );
}

export default Table;

interface RowTypeIconProps {
  type: RowType;
}

function RowTypeIcon({ type }: RowTypeIconProps) {
  switch (type) {
    case RowType.ForeignKey:
      return <Lock size={16} />;
    case RowType.PrimaryKey:
      return <KeyRound size={16} />;
    case RowType.Unique:
      return <Snowflake size={16} />;
    default:
      return null;
  }
}
