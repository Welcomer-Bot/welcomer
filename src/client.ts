import WelcomerClient from "./models/Client";
const client = new WelcomerClient();
export default client;

const handleSIG = async (): Promise<void> => {
  if (client) {
    await client.destroy();
    client.logger.error(new Error("Client was destroyed!"));
    process.exit();
  }
};

process.on("SIGINT", handleSIG);
process.on("SIGTERM", handleSIG);
process.on("SIGQUIT", handleSIG);

process.on("unhandledRejection", (error) => {
  console.error(error);
});

process.on("uncaughtException", (error) => {
  console.error(error);
});
