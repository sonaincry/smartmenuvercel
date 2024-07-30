// assets
import { IconUsers, IconBuildingStore, IconBrandMedium, IconWindmill, IconPackage } from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconBuildingStore,
  IconBrandMedium,
  IconWindmill,
  IconPackage
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const brandManagerUtilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Users',
      type: 'item',
      url: '/utils/util-typography',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'util-mybrand',
      title: 'My Brand',
      type: 'item',
      url: '/utils/util-mybrand',
      icon: icons.IconBrandMedium,
      breadcrumbs: false
    },
    {
      id: 'util-mystore',
      title: 'My Stores',
      type: 'item',
      url: '/utils/util-mystore',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'util-mycategory',
      title: 'My Product',
      type: 'item',
      url: '/utils/util-mycategory',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-mycollection',
      title: 'My Collection',
      type: 'item',
      url: '/utils/util-mycollection',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-mymenu',
      title: 'My Menu',
      type: 'item',
      url: '/utils/util-mymenu',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-mytemplate',
      title: 'My Template',
      type: 'item',
      url: '/utils/util-mytemplate',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-mycategory',
      title: 'My Category',
      type: 'item',
      url: '/utils/util-mycategory',
      icon: icons.IconPackage,
      breadcrumbs: false
    },

    {
      id: 'util-mycollection',
      title: 'My Collection',
      type: 'item',
      url: '/utils/util-mycollection',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-mymenu',
      title: 'My Menu',
      type: 'item',
      url: '/utils/util-mymenu',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-mytemplate',
      title: 'My Template',
      type: 'item',
      url: '/utils/util-mytemplate',
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

export default brandManagerUtilities;
