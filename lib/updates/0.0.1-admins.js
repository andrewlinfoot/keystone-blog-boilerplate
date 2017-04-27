/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 */
 /* eslint-disable no-console */
import keystone from 'keystone';
import async from 'async';

const User = keystone.list('User');

const admins = [{
  email: 'admin@admin.com',
  password: 'password',
}];

function createAdmin(admin, done) {
  const newAdmin = new User.model(admin);
  newAdmin.isAdmin = true;
  newAdmin.save((err) => {
    if (err) {
      console.error(`Error adding admin "${admin.email} to the database:`);
      console.error(err);
    } else {
      console.log(`Added admin ${admin.email} to the database.`);
    }
    done(err);
  });
}

module.exports = (done) => {
  async.forEach(admins, createAdmin, done);
};
