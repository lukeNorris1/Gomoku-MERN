import { string, object, TypeOf } from 'zod'

const params = {
  params: object({
    id: string({
      required_error: 'Game id is required',
    }),
  }),
}

export const getGameByIdSchema = object({
  ...params,
})

export type getGameByIdInput = TypeOf<typeof getGameByIdSchema>
