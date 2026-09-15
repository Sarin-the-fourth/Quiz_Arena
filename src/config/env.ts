const env = {
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES,
};

for (const [key, value] of Object.entries(env)) {
  if (!value) {
    throw new Error(`MISSING ENVIRONMENT VARIABLE: ${key}`);
  }
}

export default env;
