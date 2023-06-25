import fs from "fs";

function apiKeyValidator(request, response, next) {
  //@get api header
  const apiKey = request.headers["x-api-key"];

  //@Read file api key
  const apiKeys = JSON.parse(fs.readFileSync("./json/api.keys.json", "utf8"));

  //@Find the key
  const isValidApiKey = apiKeys.find((item) => item.key === apiKey);

  //@validate the api key
  if (!isValidApiKey) {
    return response.status(401).json({ message: "Invalid API Key" });
  }

  next();
}

export default apiKeyValidator;
