export type Role = "user" | "manager" | "admin";

type User = { id: string; role: Role };
type Todo = { id: string; userId: string; status: "draft" | "in_progress" | "completed" };

export const canViewTodo = (user: User, todo: Todo) => {
  
  if (user.role === "admin" || user.role === "manager") return true;
   
  return todo.userId === user.id; 
};

export const canCreateTodo = (user: User) => {

  return user.role === "user"; 
};


export const canUpdateTodo = (user: User, todo: Todo) => {
 
  if (user.role === "user") {
    return todo.userId === user.id;
  }
 
  return false;
};

export const canDeleteTodo = (user: User, todo: Todo) => {

  if (user.role === "admin") return true; 
  
  if (user.role === "user") {
    
    return todo.userId === user.id && todo.status === "draft"; 
  }
  
  return false; 
};