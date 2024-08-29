import { model, Schema } from "mongoose";

const GuildSchema = new Schema({
  id: String,
  name: String,
});

export default model("Guild", GuildSchema);
