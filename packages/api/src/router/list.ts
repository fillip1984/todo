import { z } from "zod";

import { and, eq } from "@todo/db";
import { db } from "@todo/db/client";
import { list } from "@todo/db/schema";

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
    return await db.query.list.findMany({
      where: eq(list.userId, ctx.session.user.id),
    });
  }),

  readById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await db.query.list.findFirst({
        where: and(eq(list.id, input.id), eq(list.userId, ctx.session.user.id)),
        with: {
          tasks: true,
        },
      });
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
