const mongoose = require('mongoose')
const dbConnection = require('./db_config');

dbConnection('example');


//Department Schema
const departmentSchema = new mongoose.Schema({
    department: String,
    amount: Number
})

const userSchema = new mongoose.Schema({
    name: String,
    department: String,
    gpa: Number
})

const Department = mongoose.model('Department', departmentSchema)
const User = mongoose.model('User', userSchema)

async function main() {
    await Department.deleteMany({});
    await User.deleteMany({});
    
    await Department.insertMany([
        { department: "Cs", amount: 1000},
        { department: "Maths", amount: 200},
        {department: "Chemistry", amount: 800},
        {department: "Maths", amount: 700},
        {department: "Physics", amount: 500},
        {department: "Chemistry", amount: 450},
        {department: "Cs", amount: 300}
    ])

    await User.insertMany([
        {name: "Abhinav", department: "Cs", gpa: 7.8},
        {name: "Samaresh", departmetn: "Maths", gpa: 6.5},
        {name: "Dhruv", department: "Physics", gpa: 9.1},
        {name: "Ganpath", department: "Physics", gpa: 3.6},
        {name: "Maurya", department: "Cs", gpa: 9.6},
        {name: "Abhinav", department: "Cs", gpa: 8.5},
        {name: "Sharma", department: "Maths", gpa: 9.5},
        {name: "Pahuja", department: "Chemistry", gpa: 8.6}
    ])
    
    const entries = await Department.aggregate([
        { $match: {}},
        { $group: { _id: "$department", total: {$sum: "$amount"}}},
        { $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'department',
            as: 'courses'
        }}
    ]);

    setTimeout(() => {
        console.log(entries)
    }, 2000)
}

main();