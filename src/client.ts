import WelcomerClient from "./structure/WelcomerClient";
const client = new WelcomerClient();
export default client;

process.on("unhandledRejection", (error) => {
    console.error(error)
});

process.on("uncaughtException", (error) => {
    console.error(error)
});

