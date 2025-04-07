import express from 'express';
import todoController from '../controllers/todoController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TodoInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *     TodoUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/', (req, res) => todoController.getAll(req, res));

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.get('/:id', (req, res) => todoController.getById(req, res));

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.post('/', (req, res) => todoController.create(req, res));

/**
 * @swagger
 * /api/todos/{id}:
 *   patch:
 *     summary: Update a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoUpdate'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.patch('/:id', (req, res) => todoController.update(req, res));

/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   post:
 *     summary: Toggle todo completion status
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo completion status toggled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 */
router.post('/:id/toggle', (req, res) => todoController.toggleComplete(req, res));

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 */
router.delete('/:id', (req, res) => todoController.delete(req, res));

export default router; 