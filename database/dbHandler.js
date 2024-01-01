'use strict';
import { QueryOptions } from 'mysql';
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  InternalError,
} from '../core/apiError';
// import Logger from '@app/core/Logger';
import pool from '../database/index';

//import { ClientOpts, createClient } from 'redis';
//import { REDIS_PORT } from '@app/config';

export default (
  query,
  values,
  values2,
) => {
  return new Promise((resolve, reject) => {
    const val = [JSON.stringify(values)];
    if (values2) val.push(JSON.stringify(values2));

    const option = {
      sql: query,
      values: val,
    };

    pool.query(option, (err, result) => {
      const dbr = result?.[0]?.[0] || result?.[0];
      const dbr1 = result?.[1]?.[0] || result?.[1];
      if (err) {
        console.log('Database Query:', err);
        reject(new InternalError());
      }

      if (dbr) {
        switch (true) {
          case Boolean(dbr?.state === -1 || dbr1?.state === -1):
            console.log(dbr?.message);
            reject(new BadRequestError(dbr?.message || dbr1.message));
            break;

          case Boolean(dbr?.auth_status === -1 || dbr?.auth_status === -1):
            console.log(dbr?.message);
            reject(new AuthFailureError(dbr?.message || dbr1.message));
            break;

          case Boolean(dbr?.auth_status === -2 || dbr?.auth_status === -2):
            console.log(dbr?.message);
            reject(new ForbiddenError(dbr?.message || dbr1.message));
            break;

          case Boolean(dbr?.sqlErrorState === -1 || dbr1?.sqlErrorState === -1):
            console.log(
              `[${option.sql}] ${dbr?.sqlMessage || dbr1.sqlMessage}`,
            );
            reject(new InternalError());
            break;

          default:
            result?.pop();
            return resolve(result);
        }
      } else return resolve([]);
    });
  });
};