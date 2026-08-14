import dotenv from 'dotenv';

const environment = process.env.ENV || 'qa';

dotenv.config({
  path: `.env.${environment}`,
  override: false
});

export const env = {
  baseURL: process.env.BASE_URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};