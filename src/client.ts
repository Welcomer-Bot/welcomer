import WelcomerClient from "./models/Client";
const client = new WelcomerClient();
export default client;

process.on("unhandledRejection", (error) => {
  console.error(error);
});

process.on("uncaughtException", (error) => {
  console.error(error);
});
