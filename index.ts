import express, { Request, Response } from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: "pearline.stanton@ethereal.email",
        pass: "hsFUG8dNybutwjYPva",
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

export type Task = {
    id: number;
    name: string;
    description: string;
}

let bdd : Task[] = [];

app.get("/", (request: Request, response: Response) => {
    response.status(200).send("Hello World");
});

app.get("/add" , (request: Request, response: Response) => {
    const task : Task = {
        id: bdd.length + 1,
        name: "test",
        description: "test"
    }
    bdd.push(task);
    response.status(200).send(task);
});

app.get("/tasks", (request: Request, response: Response) => {
    response.status(200).send(bdd);
});

app.get("/tasks/:id", (request: Request, response: Response) => {
    response.status(200).send(bdd.find(task => task.id === parseInt(request.params.id)));
});

app.get("/tasks/:id/update", (request: Request, response: Response) => {
    bdd = bdd.map(task => {
        if(task.id === parseInt(request.params.id)){
            task.name = "test updated";
            task.description = "test updated";
        }
        return task;
    });

    const mailOptions = {
        from: "pearline.stanton@ethereal.email",
        to: "pearline.stanton@ethereal.email",
        subject: bdd.map(task => task.name).join(", "),
        text: "Task updated",
        html: bdd.map(task => task.description).join(", "),
    };

    response.status(200).send("Task updated " + request.params.id);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })
});

app.get("/tasks/:id/delete", (request: Request, response: Response) => {
    bdd = bdd.filter(task => task.id !== parseInt(request.params.id));

    const mailOptions = {
        from: "pearline.stanton@ethereal.email",
        to: "pearline.stanton@ethereal.email",
        subject: bdd.map(task => task.name).join(", delete"),
        text: "Task deleted",
        html: bdd.map(task => task.description).join(", "),
    };

    response.status(200).send("Task deleted " + request.params.id);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })
});

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});