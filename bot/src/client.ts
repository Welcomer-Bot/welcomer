import WelcomerClient from "./structure/WelcomerClient";

console.log("Client.ts loaded, creating WelcomerClient...");
const client = new WelcomerClient();
console.log("WelcomerClient created successfully");

export default client;

process.on("unhandledRejection", (error) => {
  console.error("Client - Unhandled Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Client - Uncaught Exception:", error);
});
