import expenseSchema from "../helpers/expense.schema.js";

export default async function (request, response, next) {
  try {
    await expenseSchema.validate(request.body);
    next();
  } catch (error) {
    response.status(400).json({ message: error.message });
    return;
  }
}
