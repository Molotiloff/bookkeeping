import { notFound } from 'next/navigation';
import { userService } from '@/services';
import { canAccessRoute, type RouteKey } from './accessPolicy';

export async function requireRouteAccess(route: RouteKey): Promise<void> {
  const user = await userService.getCurrentUser();
  if (!canAccessRoute(user.role, route)) {
    notFound();
  }
}
