const { randomUUID } = require("crypto");
const http = require("http");

const users = [];

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    return res.end("Welcome to the home page");
  }
  // Método GET
  if (req.url === "/users") {
    if (req.method === "GET") {
      return res.end(JSON.stringify(users));
    }
    // Método POST
    if (req.method === "POST") {
      req
        .on("data", (data) => {
          const DataUser = JSON.parse(data);
          const user = {
            id: randomUUID(),
            ...DataUser,
          };
          users.push(user);
        })
        .on("end", () => {
          return res.end(JSON.stringify(users));
        });
    }
  }
  // Método PUT
  if (req.url.startsWith("/users") && req.method === "PUT") {
    const id = req.url.split("/")[2];
    const userIndex = users.findIndex((user) => user.id === id);

    req
      .on("data", (data) => {
        const DataUser = JSON.parse(data);
        users[userIndex] = {
          id: id,
          ...DataUser,
        };
      })
      .on("end", () => {
        return res.end(JSON.stringify(users));
      });
  }
  // Método DELETE
  if (req.url.startsWith("/users") && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    const userIndex = users.findIndex((user) => user.id === id);
    users.splice(userIndex, 1);
    return res.end("User deleted successfully");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
