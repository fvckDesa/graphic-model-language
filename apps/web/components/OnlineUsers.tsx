"use client";
import { useWorkspace } from "@/contexts/workspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_VISIBLE_USERS = 3;
const INDENT = 30; // px unit

function OnlineUsers() {
  const { onlineUsers } = useWorkspace();

  return (
    <div className="relative flex">
      {onlineUsers.slice(0, MAX_VISIBLE_USERS + 1).map((user, idx) => {
        const name = user.name ?? "Unknown";
        const image = user.image ?? "";

        return (
          <Avatar
            key={`${user.id}-${idx}`}
            className="absolute top-0"
            style={{
              right: `${INDENT * idx}px`,
              zIndex: MAX_VISIBLE_USERS - idx,
            }}
          >
            <AvatarImage src={image} alt={`${name} avatar`} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        );
      })}
    </div>
  );
}

export default OnlineUsers;
