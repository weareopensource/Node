/**
 * Task Schema
 */
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      comment: 'A title describing the task',
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Some descriptions'
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The user who created and owns this task'
    }
  });

  return Task;
};
