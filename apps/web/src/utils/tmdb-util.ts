import { TMDB } from "tmdb-ts";

import { env } from "~/env";

// if (!env.TMDB_API_KEY) {
//   throw new Error("TMDB_API_KEY is not defined");
// }

// console.log("TMDB_API_KEY", env.TMDB_API_KEY);
const tmdb = new TMDB(env.TMDB_API_KEY);

export const searchMovie = async ({ title }: { title: string }) => {
  try {
    const movies = await tmdb.search.multi({ query: title });
    // console.log(movies);
    return movies;
  } catch (err) {
    // handle error
    console.log({ msg: "Error searching movies", err: (err as Error).message });
  }
};
