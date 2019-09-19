import {
  fetch,
  addMiddleware,
  createFetch
} from './fetch'
import publicAuth from './middlewares/publicAuth';

addMiddleware(publicAuth)
export  {
  createFetch,
  fetch
}