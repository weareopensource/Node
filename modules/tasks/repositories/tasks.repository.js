/**
 * Module dependencies
 */
import mongoose from "mongoose";

const Task = mongoose.model('Task');

const defaultPopulate = [
  {
    path: 'user',
    select: 'email firstName lastName',
  },
];

/**
 * @desc Function to get all task in db with filter or not
 * @return {Array} tasks
 */
const list = (filter) => Task.find(filter).populate(defaultPopulate).sort('-createdAt').exec();

/**
 * @desc Function to create a task in db
 * @param {Object} task
 * @return {Object} task
 */
const create = (task) => new Task(task).save().then((doc) => doc.populate(defaultPopulate));

/**
 * @desc Function to get a task from db
 * @param {String} id
 * @return {Object} task
 */
const get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Task.findOne({ _id: id }).populate(defaultPopulate).exec();
};

/**
 * @desc Function to update a task in db
 * @param {Object} task
 * @return {Object} task
 */
const update = (task) => new Task(task).save().then((doc) => doc.populate(defaultPopulate));

/**
 * @desc Function to remove a task in db
 * @param {Object} task
 * @return {Object} confirmation of delete
 */
const remove = (task) => Task.removeOne({ _id: task.id }).exec();

/**
 * @desc Function to remove tasks of one user in db
 * @param {Object} filter
 * @return {Object} confirmation of delete
 */
const deleteMany = (filter) => {
  if (filter) return Task.removeMany(filter).exec();
};

/**
 * @desc Function to get collection stats
 * @return {Object} scrap
 */
const stats = () => Task.countDocuments();

/**
 * @desc Function to push list of tasks in db
 * @param {[Object]} tasks
 * @param {[String]} filters
 * @return {Object} tasks
 */
const push = (tasks, filters) =>
  Task.bulkWrite(
    tasks.map((task) => {
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
    }),
  );

  export default {
    list,
    create,
    get,
    update,
    remove,
    deleteMany,
    stats,
    push
  }