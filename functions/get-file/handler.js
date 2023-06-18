//************************************************************************************************/
// Dependencies
//************************************************************************************************/
const hredis = require("handy-redis");
const axios = require("axios");
//************************************************************************************************/
// Configuration
//************************************************************************************************/
// Redis client
const client = hredis.createNodeRedisClient({
    port: process.env["REDIS_PORT"],
    host: process.env["REDIS_HOST"],
    password: process.env["REDIS_PASSWORD"]
});
// Mock server url
const serverUrl = process.env["API_SERVER_URL"];
//************************************************************************************************/
// Kyma function main entry
//************************************************************************************************/
module.exports = {
    main: async function (event, context) {
        try {
            const ID = event.extensions.request.query.ID;
            //  Try to get File from cache
            let result = await getFileFromRedis(ID);
            //  When not found, fetch file from server
            if (!result) {
                // Fetch file
                let file = await getFileFromServer(ID);
                // Cache file
                let fileCached = await cacheFileInRedis(ID, file);
                // return result
                result = file + "(was not cached)";
            }
            // Return file
            return result ? result : { "error": `File '${ID}' was not found` };
        }
        catch (err) {
            console.log("an error occurred...", err);
            event.extensions.response
                .status(500).json({ "error": err });
        }
    }
}
//************************************************************************************************/
// Functions
//************************************************************************************************/
const getFileFromRedis = async (ID) => {
    if (ID !== undefined) {
        console.log("Getting file from cache: ", ID);
        return client.hgetall(ID);
    } else {
        throw new Error("No file identifier received!")
    }
}
const getFileFromServer = async (ID) => {
    if (ID !== undefined) {
        const fileUrl = `${serverUrl}/file/${ID}`;
        console.log("Getting file via: %s", fileUrl, " for ID: ", ID);
        const response = await axios.get(fileUrl);
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } else {
        throw new Error("No file identifier received!")
    }
}
const cacheFileInRedis = async (ID, file) => {
    console.log("Caching data to redis for file: ", ID);
    let cacheDate = new Date();
    return client.hmset(ID, ["ID", ID], ["Date", cacheDate], ["Value", file]);
}
//************************************************************************************************/