"use client";

import { useSession } from "@/lib/auth-client";
import { canDeleteTodo, canUpdateTodo, Role } from "@/lib/permissions";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export function TodoTable({ todos }: { todos: any[] }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userRole = session?.user.role as Role;
  const isElevatedRole = userRole === "admin" || userRole === "manager";

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      "draft": "in_progress", "in_progress": "completed", "completed": "draft",
    };
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatusMap[currentStatus] }),
    });
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  };

  const handleDelete = async (id: string) => {
    const response = await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) queryClient.invalidateQueries({ queryKey: ["todos"] });
  };

  return (
    <Table>
      <TableHeader className="bg-muted/30">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[200px] text-xs font-bold uppercase tracking-wider py-4 px-6">Title</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider py-4">Description</TableHead>
          <TableHead className="text-xs font-bold uppercase tracking-wider py-4">Status</TableHead>
          {isElevatedRole && <TableHead className="text-xs font-bold uppercase tracking-wider py-4">Owner</TableHead>}
          <TableHead className="text-right text-xs font-bold uppercase tracking-wider py-4 px-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isElevatedRole ? 5 : 4} className="h-32 text-center text-muted-foreground text-sm">
              No tasks found.
            </TableCell>
          </TableRow>
        ) : (
          todos.map((todo) => {
            const userContext = session ? { id: session.user.id, role: userRole } : null;
            const showDelete = userContext ? canDeleteTodo(userContext, todo) : false;
            const showUpdate = userContext ? canUpdateTodo(userContext, todo) : false;

            return (
              <TableRow key={todo.id} className="hover:bg-muted/10 transition-colors border-border/50">
                <TableCell className="font-semibold text-sm py-4 px-6">{todo.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm py-4">{todo.description || "-"}</TableCell>
                <TableCell className="py-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border ${
                    todo.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    todo.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {todo.status.replace('_', ' ')}
                  </span>
                </TableCell>
                {isElevatedRole && (
                  <TableCell className="text-xs font-medium text-muted-foreground py-4">
                    {todo.userName || "—"}
                  </TableCell>
                )}
                <TableCell className="text-right py-4 px-6 space-x-1">
                  {showUpdate && (
                    <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(todo.id, todo.status)} className="h-8 text-xs hover:text-accent-blue font-medium">
                      Update
                    </Button>
                  )}
                  {showDelete && (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(todo.id)} className="h-8 text-xs text-friendly-red hover:bg-friendly-red/5 hover:text-friendly-red font-medium">
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}