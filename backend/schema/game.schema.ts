import { string, object, TypeOf, array, number, date } from "zod";

const params = {
  params: object({
    id: string({
      required_error: "Game id is required",
    }),
  }),
};

const payload = {
  body: object({
    size: number({
      required_error: "Size is required",
    }),
    winner: string({
      required_error: "Winner is required",
    }),
    moves: array(
      number({
        required_error: "Moves are required",
      })),
  }),
};

export const getGameByIdSchema = object({
  ...params,
});

export const createGameSchema = object({
  ...payload,
});

export const deleteGameSchema = object({
  ...params,
})

export type getGameByIdInput = TypeOf<typeof getGameByIdSchema>;
