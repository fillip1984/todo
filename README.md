# TODO

A simple todo app that can be used as a template for all other projects

## What makes this project special and useful for being a template for all other projects

This application is a monorepo containing a web application (currently NextJS), a mobile application (currently expo), and an packages directory containing shared projects. It is a simple todo app but it has all of the following features:

- [x] authentication, currently better-auth, works on both the web and mobile apps
- [x] a database, using supabase or docker postgres for local, is working within the web app (ORM is currently drizzle)
- [x] a shared API framework,currently trpc+tanstack query, is used in both the web and mobile apps
- [ ] a shared UI framework (plain tailwind+shadcn on the web side, and nativewind on mobile)
- [ ] state management works in the mobile side (currently zustand)
- [x] eslint+prettier all works correctly with each other
- [x] github actions builds and deploys the web app to an aws lambda

## Resources

- [Create T3 Turbo](https://github.com/t3-oss/create-t3-turbo)
  - not used directly because Turbo and SST don't mix. SST is used to deploy to aws
- [T3 Stack](https://create.t3.gg)
  - not used directly because it isn't a monorepo and makes sharing things between a web and mobile app not possible

## TODOs

- [x] finish crud operations in mobile app
- [ ] try out skeleton loading screens
  - [ ] try using suspense or loading concepts from nextjs+react or expo router

## Stretch TODOs

- [ ] Identify and create reusable components to ease working with React Native
