// rounting info
import { NavigationItem } from '../interfaces/navigation-item.interface';
export const sidenavRouteInfo: NavigationItem[] = [
  // DASHBOARD
  {
    type: 'subheading',
    label: 'DASHBOARD',
    children: [
      {
        type: 'link',
        label: 'Dashboard',
        route: '/dashboard',
        icon: 'dashboard',
      },
    ],
  },
  // EMPLOYEE MANAGEMENT
  {
    type: 'subheading',
    label: 'EMPLOYEE MANAGEMENT',
    children: [
      {
        type: 'link',
        label: 'Employee List',
        route: 'employees/list',
        icon: 'people',
      },
      {
        type: 'link',
        label: 'Retired Employee List',
        route: 'employees/retired',
        icon: 'people_outline',
      },
      {
        type: 'link',
        label: 'Employee Leave Status',
        route: 'employees/leave-status',
        icon: 'receipt_long',
      },
      {
        type: 'link',
        label: 'Employment Contract',
        route: 'employees/contract',
        icon: 'add_business',
      },
    ],
  },
  // HOLIDAY MANAGEMENT
  {
    type: 'subheading',
    label: 'HOLIDAY MANAGEMENT',
    children: [
      {
        type: 'link',
        label: 'Holiday List',
        route: 'holidays',
        icon: 'today',
      },
    ],
  },
];
