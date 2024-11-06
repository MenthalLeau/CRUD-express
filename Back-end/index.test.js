"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("./index"); // Remplace par le chemin correct de ton fichier app.ts
describe('Task API Tests', () => {
    let taskId;
    it('should create a new task', () => __awaiter(void 0, void 0, void 0, function* () {
        const taskData = {
            name: "Test Task",
            description: "This is a test task description",
        };
        const response = yield (0, supertest_1.default)(index_1.app).post('/add').send(taskData);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(taskData.name);
        expect(response.body.description).toBe(taskData.description);
        // Store the created task ID for later tests
        taskId = response.body.id;
    }));
    it('should get all tasks', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    it('should get a task by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).get(`/tasks/${taskId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(taskId);
    }));
    it('should update an existing task', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedTask = {
            name: "Updated Test Task",
            description: "Updated test task description",
        };
        const response = yield (0, supertest_1.default)(index_1.app)
            .post(`/tasks/${taskId}/update`)
            .send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Task ${taskId} updated`);
        // Verify the task update
        const updatedResponse = yield (0, supertest_1.default)(index_1.app).get(`/tasks/${taskId}`);
        expect(updatedResponse.status).toBe(200);
        expect(updatedResponse.body.name).toBe(updatedTask.name);
        expect(updatedResponse.body.description).toBe(updatedTask.description);
    }));
    it('should delete a task', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app).post(`/tasks/${taskId}/delete`);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Task ${taskId} deleted`);
    }));
});
