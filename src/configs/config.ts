export const JWT_ACCESS_TOKEN_EXP = "24h";
export const JWT_REFRESH_TOKEN_EXP = "24h";

// const JWT_ACCESS_TOKEN_EXP = process.env.JWT_ACCESS_TOKEN_EXP || '15m';
// const JWT_REFRESH_TOKEN_EXP = process.env.JWT_REFRESH_TOKEN_EXP || '7d';

export const ROLE_ENUM = {
  ADMIN: "admin",
  USER: "user",
};
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? "SECRET_KEY";
if (JWT_SECRET_KEY == "SECRET_KEY") {
  throw new Error("INVALID JWT_SECRET_KEY");
}
