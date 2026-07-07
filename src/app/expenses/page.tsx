import { ExpensesView } from '@/components/expenses/ExpensesView';
import { expensesService } from '@/services';

export default async function ExpensesPage() {
  const data = await expensesService.getExpensesPage();

  return <ExpensesView data={data} />;
}
