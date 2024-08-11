import {ObjectId, Schema, SchemaTypes, model} from "mongoose";

export interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
}
    
const UserSchema = new Schema<User>({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    accessToken: {
        type: SchemaTypes.String,
        required: true
    },
    refreshToken: {
        type: SchemaTypes.String,
        required: true
    },
})

export default model("User", UserSchema);