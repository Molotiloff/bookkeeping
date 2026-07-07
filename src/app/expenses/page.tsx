import { ExpensesView } from '@/components/expenses/ExpensesView';
import { expensesService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';

export default async function ExpensesPage() {
  await requireRouteAccess('/expenses');
  const data = await expensesService.getExpensesPage();

  return <ExpensesView data={data} />;
}
