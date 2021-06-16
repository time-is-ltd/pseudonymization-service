import { Unpacked } from './unpacked.interface'
/*
 Replaces recursively property type with symbol | string | number
  ej:
  type T0 = Schema<{
    id: string,
    items: Array<{
      id: string,
      createdAt: string,
      price: number
    }>,
    tags: string[]
  }> // {
    id: symbol | string | number,
    items: Array<{
      id: symbol | string | number,
      createdAt: symbol | string | number,
      price: symbol | string | number
    }>,
    tags: symbol | string | number
  }
*/
export type Schema<T> = {
  [P in keyof T]:
  Unpacked<T[P]> extends Array<infer U> ? Array<Schema<U>> :
    Unpacked<T[P]> extends object ? Schema<T[P]> :
      symbol | string | string[] | number | number[] | symbol[]
}
