/**
 * Module dependencies
 */
import mongoose from 'mongoose';
import Task from '../models/tasks.model.mongoose';

const defaultPopulate = [{
  path: 'user',
  select: 'email firstName lastName',
},
];

/**
 * @desc Function to get all task in db with filter or not
 * @return {Array} tasks
 */
export async function list(filter?: any) {
  return Task.find(filter)
    .populate(defaultPopulate)
    .sort('-createdAt')
    .exec();
}

/**
 * @desc Function to create a task in db
 * @param {Object} task
 * @return {Object} task
 */
export async function create(task) {
  return new Task(task).save()
    .then((doc) => doc.populate(defaultPopulate)
      .execPopulate());
}

/**
 * @desc Function to get a task from db
 * @param {String} id
 * @return {Object} task
 */
export async function get(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Task.findOne({ _id: id }).populate(defaultPopulate).exec();
}

/**
 * @desc Function to update a task in db
 * @param {Object} task
 * @return {Object} task
 */
export async function update(task) {
  return new Task(task).save()
    .then((doc) => doc.populate(defaultPopulate)
      .execPopulate());
}

/**
 * @desc Function to delete a task in db
 * @param {Object} task
 * @return {Object} confirmation of delete
 */
export async function deleteTask(task) {
  return Task.deleteOne({ _id: task.id })
    .exec();
}

/**
 * @desc Function to delete tasks of one user in db
 * @param {Object} filter
 * @return {Object} confirmation of delete
 */
export async function deleteMany(filter) {
  if (filter) return Task.deleteMany(filter).exec();
}

/**
 * @desc Function to get collection stats
 * @return {Object} scrap
 */
export async function stats() {
  return Task.countDocuments();
}

/**
 * @desc Function to import list of tasks in db
 * @param {[Object]} tasks
 * @param {[String]} filters
 * @return {Object} tasks
 */
export async function importTask(tasks, filters) {
  return Task.bulkWrite(tasks.map((task) => {
    const filter = {};
    filters.forEach((value) => {
      filter[value] = task[value];
    });
    return {
      updateOne: {
        filter,
        update: task,
        upsert: true,
      },
    };
  }));
}
