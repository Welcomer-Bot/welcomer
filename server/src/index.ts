import { config } from 'dotenv';
config();
import { createApp } from './utils/createApp';
import "./database"

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        const app = createApp();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}, running in ${process.env.NODE_ENV} mode`);
        });    
    } catch (error) {
        console.error(error);
    }
}

main()