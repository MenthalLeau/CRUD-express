import express, { Request, Response } from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// configures dotenv to work in your application
dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT;

export const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "pearline.stanton@ethereal.email",
        pass: "hsFUG8dNybutwjYPva",
    },
});

export type Task = {
    id: number;
    name: string;
    description: string;
}

let bdd : Task[] = [];

app.post("/add" , (request: Request, response: Response) => {
    const task : Task = {
        id: bdd.length + 1,
        name: request.body.name,
        description: request.body.description
    }
    bdd.push(task);

    const mailOptions = {
        from: "pearline.stanton@ethereal.email",
        to: "pearline.stanton@ethereal.email",
        subject: request.body.name+ " created",
        text: request.body.description,
        html: request.body.description,
    };
    response.status(200).send(task);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })
});

app.get("/tasks", (request: Request, response: Response) => {
    response.status(200).send(bdd);
});

app.get("/tasks/:id", (request: Request, response: Response) => {
    response.status(200).send(bdd.find(task => task.id === parseInt(request.params.id)));
});

app.post("/tasks/:id/update", (request: Request, response: Response) => {
    const originalTask = bdd.find(task => task.id === parseInt(request.params.id));
    const originalName = originalTask ? originalTask.name : "Nom introuvable";
    const originalDescription = originalTask ? originalTask.description : "Description introuvable";

    bdd = bdd.map(task => {
        if(task.id === parseInt(request.params.id)){
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })
});

app.post("/tasks/:id/delete", (request: Request, response: Response) => {
    bdd = bdd.filter(task => task.id !== parseInt(request.params.id));


    const mailOptions = {
        from: "pearline.stanton@ethereal.email",
        to: "pearline.stanton@ethereal.email",
        subject: request.body.name+ " deleted",
        text: request.body.description,
        html: request.body.description,
    };

    response.status(200).send("Task " + request.params.id + " deleted");

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })
});

export { app };

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});