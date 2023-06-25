import fs from "fs";
import Expense from "../models/expense.js";
import moment from "moment/moment.js";

//Create all the controllers

export const getAllExpenses = async (request, response) => {
  try {
    //@read data from file
    const expenseData = JSON.parse(
      fs.readFileSync("./json/expenses.json", "utf8")
    );

    if (!expenseData) {
      return response.status(404).json({ message: "Data not found" });
    }

    //@send response to client
    response.status(200).json({ message: "success", data: expenseData });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const getExpenseById = async (request, response) => {
  try {
    const expenseData = JSON.parse(
      fs.readFileSync("./json/expenses.json", "utf-8")
    );

    //find expense by ud
    const expenseDetails = expenseData.find(
      (item) => item.id === request.params.id
    );

    if (!expenseDetails) {
      return response.status(404).json({ message: "Expense not found" });
    }

    //@Send response to client
    response.status(200).json({ message: "succes", data: expenseDetails });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const createExpense = async (request, response) => {
  try {
    //@Read data from body and construct object
    const expense = new Expense(
      request.body?.category,
      request.body?.description,
      request.body?.amount,
      request.body?.currency,
      request.body?.payment_method
    );

    //@Read file json and push new data
    const prevExpense = JSON.parse(
      fs.readFileSync("./json/expenses.json", "utf-8")
    );
    prevExpense.push(expense);

    //@write file to expense json
    const newExpense = JSON.stringify(prevExpense, null, 2);
    fs.writeFileSync("./json/expenses.json", newExpense);

    //@Send response to client
    response
      .status(201)
      .json({ message: "Success add expense", data: expense });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const updateExpenseById = async (request, response) => {
  const id = request.params.id;
  try {
    //@read file
    const expenseData = JSON.parse(
      fs.readFileSync("./json/expenses.json", "utf8")
    );

    //@check the data exists
    const expenseIndex = expenseData.findIndex((item) => item.id === id);

    if (expenseIndex === -1) {
      return response.status(404).json({ message: "Expense not found" });
    }
    //@update data partially
    const updatedExpense = Object.assign(
      {},
      expenseData[expenseIndex],
      request.body
    );
    expenseData[expenseIndex] = updatedExpense;

    //@Write into file
    const newExpenseData = JSON.stringify(expenseData, null, 2);
    fs.writeFileSync("./json/expenses.json", newExpenseData);

    //@Send response to client
    response.status(200).json({
      message: "Update expense successfully",
      data: expenseData[expenseIndex],
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Server error" });
  }
};

export const deleteExpenseById = (request, response) => {
  const id = request.params.id;
  try {
    const expenseData = JSON.parse(
      fs.readFileSync("./json/expenses.json", "utf-8")
    );

    const expenseIndex = expenseData.findIndex((item) => item.id === id);

    if (expenseIndex === -1) {
      return response.status(404).json({ message: "Expense not found" });
    }

    expenseData.splice(expenseIndex, 1);

    const newExpenseData = JSON.stringify(expenseData, null, 2);
    fs.writeFileSync("./json/expenses.json", newExpenseData);
    response.status(200).json({ message: "delete expense success" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "server error" });
  }
};

export const getTotalExpense = async (request, response) => {
  const { category, start, end } = request.query;
  try {
    // @read expense data from JSON
    const expenseData = JSON.parse(
      fs.readFileSync("./json/expense.json", "utf-8")
    );

    // @create copy of expense data
    let filteredData = [...expenseData];

    // @filter by date
    if (start && end) {
      filteredData = filteredData.filter((expense) =>
        moment(expense.date).isBetween(start, end, "day", "[]")
      );
    }

    // @filter by category
    if (category) {
      // @expect category with multiple words, example: "Food,Drink"
      const categoryArray = category.split(",");
      filteredData = filteredData.filter((expense) =>
        categoryArray.includes(expense.category?.toLowerCase())
      );
    }

    // @calculate total expense
    const totalExpense = filteredData.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    response.status(200).json({ totalExpense });

    // @check if category is exist
    // if (category) {
    //     // @expect category with multiple words, example: "Food,Drink"
    //     const categoryArray = category.split(",")
    //     const filteredData = expenseData.filter(expense => categoryArray.includes(expense.category?.toLowerCase()))

    //     // @calculate total expense
    //     const totalExpense = filteredData.reduce((acc, curr) => acc + curr.amount, 0)
    //     res.status(200).json({ totalExpense })
    // }

    // @check if start and end is exist
    // if (start && end) {
    //     const filteredData = expenseData.filter(expense => moment(expense.date).isBetween(start, end, "day", "[]"))

    //     // @calculate total expense
    //     const totalExpense = filteredData.reduce((acc, curr) => acc + curr.amount, 0)
    //     res.status(200).json({ totalExpense })
    // }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Server Error" });
  }
};
