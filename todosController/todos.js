const express = require('express');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Require Todo model in our routes module
let Todo = require('../models/Todo');

class TodosController {

  async getAllTodos(req, res) {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      console.log(error);
    }
  }

  async getTodo(req, res) {
    const { id } = req.params;
    if (!ObjectId.isValid(id) && !id.match(/^[a-fA-F0-9]{24}$/)) {
      return res.status(404).send({
        success: 'false',
        message: 'todo does not exist',
      });
    }
    try {
      const todos = await Todo.findById(id);


      const todoData = {
        title: todos.title,
        body: todos.body,
      }

      res.json(todoData);
    } catch (error) {
      console.log(error);
    }
  }

  async createTodo(req, res) {
    let newTodo = new Todo(req.body.dataTodo);
    if (!req.body.dataTodo.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required',
      });
    }
    try {
      const todo = await newTodo.save();
      res.status(200).json(todo);
    } catch (error) {
      res.status(400).send({
        success: 'false',
        message: 'Unable to save to database',
      });
    }
  }

  async updateTodo(req, res) {
    const { id } = req.params;
    const dataTodo = req.body.dataTodo;

    if (!ObjectId.isValid(id) && !id.match(/^[a-fA-F0-9]{24}$/)) {
      return res.status(404).send({
        success: 'false',
        message: 'todo does not exist',
      });
    }
    if (!dataTodo.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required',
      });
    }

    try {
      const updated = await Todo.findByIdAndUpdate(id, dataTodo, { new: true });
      return res.status(200).json(updated);

    } catch (error) {
      res.json(error);
    }
  }

  async deleteTodo(req, res) {
    const { id } = req.params;
    if (!ObjectId.isValid(id) && !id.match(/^[a-fA-F0-9]{24}$/)) {
      return res.status(404).send({
        success: 'false',
        message: 'todo does not exist',
      });
    }
    try {
      const deleted = await Todo.findByIdAndRemove(id);
      return res.status(200).json(deleted);
    } catch (error) {
      res.status(400).send({
        success: 'false',
        message: 'Unable to delete from database',
      });
    }
  }

}

const TodoController = new TodosController();
module.exports = TodoController;
