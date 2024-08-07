const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const port = 1200;

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client/src/components/card")));

app.use("/user", require("./Routes/userRoutes"));
app.use("/task",require("./Routes/taskRoutes"))

app.get('/api/team-members', (req, res) => {
  const teamMembers = [
    { id: '1', name: 'Alice', role: 'Developer' },
    { id: '2', name: 'Bob', role: 'Designer' },
    // Add more team members as needed
  ];
  res.json(teamMembers);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
