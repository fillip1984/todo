import { z } from "zod";

import { and, eq } from "@todo/db";
import { db } from "@todo/db/client";
import { list, task } from "@todo/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await db.insert(list).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  readAll: protectedProcedure.query(async ({ ctx }) => {
    const results = db.query.list.findMany({
      where: eq(list.userId, ctx.session.user.id),
      columns: {
        createdAt: false,
        updatedAt: false,
        userId: false,
      },
    });
    // TODO: there's a bug in drizzle for performing counts on child objects,
    // check back once drizzle 1.0 drops
    const listsWithTaskCount = (await results).map(async (listItem) => {
      const tasks = await ctx.db.query.task.findMany({
        where: eq(task.listId, listItem.id),
        columns: {
          id: true,
          complete: true,
        },
      });
      const taskCount = tasks.length;
      const completedTaskCount = tasks.filter((task) => task.complete).length;
      return { ...listItem, taskCount, completedTaskCount };
    });

    return Promise.all(listsWithTaskCount);
  }),

  readById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await db.query.list.findFirst({
        where: and(eq(list.id, input.id), eq(list.userId, ctx.session.user.id)),
        with: {
          tasks: {
            where: eq(task.listId, input.id),
            orderBy: (task, { asc }) => [asc(task.createdAt)],
            columns: {
              createdAt: false,
              updatedAt: false,
              userId: false,
            },
          },
        },
        columns: {
          createdAt: false,
          updatedAt: false,
          userId: false,
        },
      });
      return result ?? null;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await db
        .update(list)
        .set(data)
        .where(and(eq(list.id, id), eq(list.userId, ctx.session.user.id)));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db
        .delete(list)
        .where(
          and(eq(list.id, input.id), eq(list.userId, ctx.session.user.id)),
        );
    }),
});
