"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.transporter = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// configures dotenv to work in your application
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
const PORT = process.env.PORT;
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "pearline.stanton@ethereal.email",
        pass: "hsFUG8dNybutwjYPva",
    },
});
let bdd = [];
app.post("/add", (request, response) => {
    const task = {
        id: bdd.length + 1,
        name: request.body.name,
        description: request.body.description
    };
    bdd.push(task);
    const mailOptions = {
        from: "pearline.stanton@ethereal.email",
        to: "pearline.stanton@ethereal.email",
        subject: request.body.name + " created",
        text: request.body.description,
        html: request.body.description,
    };
    response.status(200).send(task);
    exports.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
});
app.get("/tasks", (request, response) => {
    response.status(200).send(bdd);
});
app.get("/tasks/:id", (request, response) => {
    response.status(200).send(bdd.find(task => task.id === parseInt(request.params.id)));
});
app.post("/tasks/:id/update", (request, response) => {
    const originalTask = bdd.find(task => task.id === parseInt(request.params.id));
    const originalName = originalTask ? originalTask.name : "Nom introuvable";
    const originalDescription = originalTask ? originalTask.description : "Description introuvable";
    bdd = bdd.map(task => {
        if (task.id === parseInt(request.params.id)) {
            task.name = request.body.name;
            task.description = request.body.description;
        }
        return task;
    });
    const mailOptions = {
        from: "pearline.stanton@ethereal.email",
        to: "pearline.stanton@ethereal.email",
        subject: `${originalName} updated to ${request.body.name}`,
        text: `The task description was updated from "${originalDescription}" to "${request.body.description}".`,
        html: `<p>The task description was updated from "${originalDescription}" to "${request.body.description}".</p>`,
    };
    response.status(200).send("Task " + request.params.id + " updated");
    exports.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
});
app.post("/tasks/:id/delete", (request, response) => {
    bdd = bdd.filter(task => task.id !== parseInt(request.params.id));
    const mailOptions = {
        from: "pearline.stanton@ethereal.email",
        to: "pearline.stanton@ethereal.email",
        subject: request.body.name + " deleted",
        text: request.body.description,
        html: request.body.description,
    };
    response.status(200).send("Task " + request.params.id + " deleted");
    exports.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
});
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
