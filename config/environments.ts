import dotenv from 'dotenv';

const environment = process.env.ENV || 'qa';

dotenv.config({
  path: `.env.${environment}`,
  override: false
});

const prefix = environment.toUpperCase();

export const env = {
  baseURL:
    process.env[`${prefix}_BASE_URL`] ||
    process.env.BASE_URL!,

  username:
    process.env[`${prefix}_USERNAME`] ||
    process.env.USERNAME!,

  password:
    process.env[`${prefix}_PASSWORD`] ||
    process.env.PASSWORD!
};