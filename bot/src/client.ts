import WelcomerClient from "./structure/WelcomerClient";


let client = new WelcomerClient();

process.on("unhandledRejection", (error) => {
    console.error(error)
});

process.on("uncaughtException", (error) => {
    console.error(error)
});