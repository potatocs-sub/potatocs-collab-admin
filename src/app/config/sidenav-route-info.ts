// rounting info
import { NavigationItem } from '../interfaces/navigation-item.interface'
export const sidenavRouteInfo: NavigationItem[] = [

  // dashboard
  {
    type: 'link',
    label: 'Dashboard',
    route: '/main',
    icon: 'dashboard',
    isNsAdmin: true
  },
  // Leave
  {
    type: 'subheading',
    label: 'Employee Management',
    children: [
      {
        type: 'link',
        label: 'Employee Leave Status',
        route: 'employees/leaves',
        icon: 'receipt_long',
      },
      {
        type: 'link',
        label: 'Employee List',
        route: 'employees/list',
        icon: 'list',
      },
      {
        type: 'link',
        label: 'Employee Company Request',
        route: 'employees/requests',
        icon: 'add_business',
      },
      {
        type: 'link',
        label: 'Retired Employee List',
        route: 'employees/retired',
        icon: 'list',
      },
    ]
  },
  {
    type: 'subheading',
    label: 'Corporation',
    children: [
      {
        type: 'link',
        label: 'Holiday Management',
        route: 'company-holidays',
        icon: 'update',
      }
    ]
  },
  // document 
  {
    type: 'subheading',
    label: 'Documents',
    children: [
      {
        type: 'link',
        label: 'Important documents',
        route: 'documents',
        icon: 'folder_special',
      }
    ]
  },
  // contract 
  {
    type: 'subheading',
    label: 'Contract',
    children: [
      {
        type: 'link',
        label: 'Contract management',
        route: 'contracts',
        icon: 'handshake',
      }
    ]
  }
];
