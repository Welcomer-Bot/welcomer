import { model, models, Schema } from "mongoose";

const GuildSchema = new Schema({
  id: String,
  name: String,
});

export default models?.Guild || model("Guild", GuildSchema);
