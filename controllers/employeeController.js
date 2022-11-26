const Employee = require('../models/Employee');


const getAllEmployees = async (req, res) => {
    //get all employee docs form db
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({'message': 'No employees found'});
    res.json(employees)
};

const createNewEmployees = async (req, res) => {
    if(!req.body.firstname || !req.body.lastname){
        res.status(400).json({ 'message' : 'Fist and Last names are required'});
    }    

    //if all both req are received
    try{
        //then create and insert doc to the collection
        const result = await Employee.create({
            firstname : req.body.firstname,
            lastname : req.body.lastname
        });
        res.status(201).json(result)

    }catch(err){
        console.log(err);
    }
};

const updateEmployees = async (req, res) => {
    //need to pass id req to get and update specific employee
    if(!req.body.id) {
        return res.status(400).json({ 'message' : 'Employee ID is required'});
    }

    //find employee from db that match received id
    const employee = await Employee.findOne({ _id : req.body.id }).exec();
    if(!employee){ 
        return res.status(204).json({ 'message' : `No employee mathch ID ${req.body.id}.`});
    }

    //first and last names will be updated when employee is found
    if(req.body.firstname) employee.firstname = req.body.firstname;
    if(req.body.lastname) employee.lastname = req.body.lastname;

    //after updating, save the changes
    const result = await employee.save();
    res.json(result);
};

const deleteEmployee = async (req, res) => {
    if(!req.body.id){
        return res.status(400).json({'message' : 'Employee ID is required'});
    }

    const employee = await Employee.findOne({ _id : req.body.id }).exec();
    if(!employee) return res.status(204).json({'message' : `No Employee matchs ID ${req.body.id}`});

    //delete employee that match req.body.id and don't need to save since it has no changes
    const result = await employee.deleteOne({_id : req.body.id });
    res.json(result);
};

const getEmployee = async (req,res) => {
    //accept id as params from url
    if(!req.params.id){
        return res.status(400).json({ 'message' : 'ID   params is required'});
    }
    const employee = await Employee.findOne({_id : req.params.id}).exec();
    if(!employee){
        return res.status(204).json({'message' : `No employee match ID ${req.params.id}.`});
    }
   
    res.json(employee);
};


module.exports = {
    getAllEmployees,
    createNewEmployees,
    updateEmployees,
    deleteEmployee,
    getEmployee
}