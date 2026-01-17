import { listRouter } from "./router/list";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  list: listRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
