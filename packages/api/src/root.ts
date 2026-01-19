import { adminRouter } from "./router/admin";
import { listRouter } from "./router/list";
import { taskRouter } from "./router/task";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  list: listRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
