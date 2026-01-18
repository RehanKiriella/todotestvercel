"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TodoTable } from "@/components/todo-table";
import { CreateTodoForm } from "@/components/create-todo-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { canCreateTodo, Role } from "@/lib/permissions"; 

export default function Home() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  
  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/login");
    }
  }, [session, isSessionLoading, router]);

  const { data: todos, isLoading: isTodosLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      return response.json();
    },
    enabled: !!session, 
  });

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const canCreate = session ? canCreateTodo({ 
    id: session.user.id, 
    role: session.user.role as Role 
  }) : false;

  if (isSessionLoading || !session) {
    return (
      <div className="flex h-screen items-center justify-center">
   <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Todos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as <span className="font-semibold text-foreground capitalize">{session.user.role}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {canCreate && <CreateTodoForm />}
          <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs font-medium">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl subtle-shadow overflow-hidden">
        {isTodosLoading ? (
          <div className="p-20 text-center text-muted-foreground text-sm animate-pulse">
            Loading your workspace...
          </div>
        ) : (
          <TodoTable todos={todos || []} />
        )}
      </div>
    </div>
  );
}