// assets
import { IconUsers, IconBuildingStore, IconBrandMedium, IconWindmill, IconPackage, IconTemplate } from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconBuildingStore,
  IconBrandMedium,
  IconWindmill,
  IconPackage,
  IconTemplate
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-user',
      title: 'Users',
      type: 'item',
      url: '/utils/util-user',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'util-brand',
      title: 'Brands',
      type: 'item',
      url: '/utils/util-brand',
      icon: icons.IconBrandMedium,
      breadcrumbs: false
    },
    {
      id: 'util-store',
      title: 'Stores',
      type: 'item',
      url: '/utils/util-store',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },

    {
      id: 'util-product',
      title: 'Products',
      type: 'item',
      url: '/utils/util-product',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-display',
      title: 'Display',
      type: 'item',
      url: 'pages/choose-template',
      icon: icons.IconWindmill,
      breadcrumbs: false
    },
    {
      id: 'icons',
      title: 'Icons',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'tabler-icons',
          title: 'Tabler Icons',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Material Icons',
          type: 'item',
          external: true,
          target: '_blank',
          url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default utilities;
