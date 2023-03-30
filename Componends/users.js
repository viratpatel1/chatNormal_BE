let users = [];

const addUsers = ({ id, name, room }) =>
{
    // console.log("user ", id, name, room)
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existUser = users.find((user) => user.room === room && user.name === name);
    if (existUser)
    {
        return { error: "Username is Already Taken try with Different Name" };
    }

    const user = { id, name, room };

    users.push(user);
    return { user }
};

const removeUser = (id) =>
{
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1)
    {
        return users.splice(index, 1)[0];
    }
};

const getUsers = (id) => users.find((user) => user.id === id);

const getUserInRoom = (room) => users.filter((user) => user.room === room);


module.exports = { addUsers, getUsers, getUserInRoom, removeUser };