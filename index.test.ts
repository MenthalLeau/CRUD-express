import request from 'supertest';
import { app } from './index';  // Remplace par le chemin correct de ton fichier app.ts

describe('Task API Tests', () => {

    let taskId: number;

    it('should create a new task', async () => {
        const taskData = {
            name: "Test Task",
            description: "This is a test task description",
        };

        const response = await request(app).post('/add').send(taskData);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(taskData.name);
        expect(response.body.description).toBe(taskData.description);

        // Store the created task ID for later tests
        taskId = response.body.id;
    });

    it('should get all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get a task by ID', async () => {
        const response = await request(app).get(`/tasks/${taskId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(taskId);
    });

    it('should update an existing task', async () => {
        const updatedTask = {
            name: "Updated Test Task",
            description: "Updated test task description",
        };

        const response = await request(app)
            .post(`/tasks/${taskId}/update`)
            .send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Task ${taskId} updated`);

        // Verify the task update
        const updatedResponse = await request(app).get(`/tasks/${taskId}`);
        expect(updatedResponse.status).toBe(200);
        expect(updatedResponse.body.name).toBe(updatedTask.name);
        expect(updatedResponse.body.description).toBe(updatedTask.description);
    });

    it('should delete a task', async () => {
        const response = await request(app).post(`/tasks/${taskId}/delete`);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Task ${taskId} deleted`);
    });
});
