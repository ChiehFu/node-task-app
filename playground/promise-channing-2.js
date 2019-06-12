require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndRemove('5cfbfc9f4e7db1c596f601cd').then((res) => {
//     console.log(res);
//     return Task.countDocuments({ completed: false});
// }).then((res) => {
//     console.log('Impleted tasks: ', res);
// }).catch((e) => {
//     console.log(e);
// });

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndRemove(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
};

deleteTaskAndCount('5cfbf348a1f134c3e0a42cb7').then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e);
});