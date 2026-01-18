import { listRouter } from "./router/list";
import { taskRouter } from "./router/task";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  list: listRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const auditFields = {
  createdAt: false,
  updatedAt: false,
  userId: false,
};
