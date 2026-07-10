import { adminRouter } from "./router/admin";
import { collectionRouter } from "./router/collection";
import { taskRouter } from "./router/task";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  collection: collectionRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
