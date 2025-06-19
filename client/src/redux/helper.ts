/* eslint-disable @typescript-eslint/no-explicit-any */
type EntityType = "Income" | "Expense" | "User" | "Dashboard";

export const getEntitiesFromResult = <T extends EntityType>(
  result: any,
  entityType: T
): Array<{ type: T; id: string | number }> => {
  if (Array.isArray(result)) {
    return result.map(({ id }) => ({ type: entityType, id }));
  }
  if (result && typeof result === "object" && "id" in result) {
    return [{ type: entityType, id: result.id }];
  }
  return [];
};

// Usage examples:
export const getIncomeFromResult = (result: any) =>
  getEntitiesFromResult(result, "Income");

export const getExpenseFromResult = (result: any) =>
  getEntitiesFromResult(result, "Expense");

export const getUsersFromResult = (result: any) =>
  getEntitiesFromResult(result, "User");

export const getDashboardFromResult = (result: any) =>
  getEntitiesFromResult(result, "Dashboard");
