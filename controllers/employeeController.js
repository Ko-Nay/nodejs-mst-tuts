const { parse } = require('date-fns');

const data = {
    employees : require('../data/employees.json'),
    setEmployees : function (data) { this.employees = data }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees)
};

const createNewEmployees = (req, res) => {
    const newEmployee = {
        id : data.employees[data.employees.length - 1].id + 1 || 1,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
    }

    if(!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message' : 'Fist name and last name are required'});
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmployees = (req, res) => {
    const updateEmployee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
    if(!updateEmployee){
        return res.status(400).json({'message' : `Employee ID ${req.body.id} not found`})
    }
    if(req.body.firstname) updateEmployee.firstname = req.body.firstname;
    if(req.body.lastname) updateEmployee.lastname =  req.body.lastname;

    /** remove the previous employee and replace the updated data */
    const removeOldEmployee = data.employees.filter( (oldEmployee) => oldEmployee.id !== parseInt(req.body.id))
    const updatedEmployee = [ ...removeOldEmployee, updateEmployee];
    data.setEmployees[updatedEmployee];

    res.status(200).json(data.employees)
};

const deleteEmployee = (req, res) => {
    const deleteEmployee = data.employees.find((emp) => emp.id === parseInt(req.body.id));
    if(!deleteEmployee){
        return res.status(400).json({'message' : `Employee ID ${req.body.id} not found`})
    }
    
    /** remove the previous employee and replace the updated data */
    const filteredArray = data.employees.filter( (oldEmployee) => oldEmployee.id !== parseInt(req.body.id))
    data.setEmployees([...filteredArray]);

    res.json(data.employees)
};

const getEmployee = (req,res) => {
    const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));
    if(!deleteEmployee){
        return res.status(400).json({'message' : `Employee ID ${req.params.id} not found`})
    }
    res.status(200).json(employee)
};


module.exports = {
    getAllEmployees,
    createNewEmployees,
    updateEmployees,
    deleteEmployee,
    getEmployee
}