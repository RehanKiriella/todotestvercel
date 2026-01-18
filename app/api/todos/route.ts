import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { todos, user } from "@/lib/db/schema"; 
import { canViewTodo, canDeleteTodo, canUpdateTodo, Role } from "@/lib/permissions"; 
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  
  const allTodosWithUsers = await db
    .select({
      id: todos.id,
      title: todos.title,
      description: todos.description,
      status: todos.status,
      userId: todos.userId,
      userName: user.name, 
    })
    .from(todos)
    .leftJoin(user, eq(todos.userId, user.id));

  const filteredTodos = allTodosWithUsers.filter((todo) => 
    canViewTodo({ role: session.user.role as Role, id: session.user.id }, todo as any)
  );

  return NextResponse.json(filteredTodos);
}


export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user.role !== "user" && session.user.role !== "admin")) {
    return new NextResponse("Forbidden: Invalid Role", { status: 403 });
  }
  const { title, description, status } = await req.json();
  const newTodo = await db.insert(todos).values({
    id: crypto.randomUUID(),
    title,
    description: description || "",
    status: status || "in_progress",
    userId: session.user.id,
  }).returning();
  return NextResponse.json(newTodo[0]);
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const { id, status } = await req.json();
  const [todo] = await db.select().from(todos).where(eq(todos.id, id));
  if (!todo) return new NextResponse("Not Found", { status: 404 });
  if (!canUpdateTodo({ role: session.user.role as Role, id: session.user.id }, todo as any)) {
    return new NextResponse("Forbidden: You cannot update this task", { status: 403 });
  }
  await db.update(todos).set({ status }).where(eq(todos.id, id));
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await req.json();
  const [todo] = await db.select().from(todos).where(eq(todos.id, id));
  if (!todo) return new NextResponse("Not Found", { status: 404 });
  if (!canDeleteTodo({ role: session.user.role as Role, id: session.user.id }, todo as any)) {
    return new NextResponse("Forbidden: Action restricted by role/status", { status: 403 });
  }
  await db.delete(todos).where(eq(todos.id, id));
  return new NextResponse(null, { status: 204 });
}