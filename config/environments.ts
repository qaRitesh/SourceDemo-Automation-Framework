import dotenv from 'dotenv';

const environment = process.env.ENV || 'qa';

dotenv.config({
  path: `.env.${environment}`
});

const prefix = environment.toUpperCase();

export const env = {
  baseURL: process.env[`${prefix}_BASE_URL`]!,
  username: process.env[`${prefix}_USERNAME`]!,
  password: process.env[`${prefix}_PASSWORD`]!
};