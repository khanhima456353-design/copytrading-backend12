declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

declare const process: {
  env: {
    REACT_APP_API_URL?: string;
    [key: string]: string | undefined;
  };
};