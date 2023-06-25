import { Router } from "express";
import expenseValidator from "../middleware/expense.validator.js";

//@create routes
const router = Router();

//@import controllers
import * as ExpensesController from "../controllers/index.js";

//@Define the routes
router.post("/expense", expenseValidator, ExpensesController.createExpense);
router.get("/expense", ExpensesController.getAllExpenses);
router.get("/expense/total", ExpensesController.getTotalExpense);
router.get("/expense/:id", ExpensesController.getExpenseById);
router.patch("/expense/:id", ExpensesController.updateExpenseById);
router.delete("/expense/:id", ExpensesController.deleteExpenseById);

export default router;
