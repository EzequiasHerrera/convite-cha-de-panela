import { createClient } from "redis";

const client = createClient({
  username: "admin",
  password: "admin",
  socket: {
    host: "redis-18037.crce181.sa-east-1-2.ec2.redns.redis-cloud.com",
    port: 18037,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();



await client.set("lista", "bar");
const result = await client.get("foo");
console.log(result);
