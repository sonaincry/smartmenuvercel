import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import entities from './entities';
import other from './other';
import brandManagerUtilities from './brandManagerUtilities';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, pages, utilities, entities, other], // Initial items for ADMIN
  brandManagerItems: [dashboard, pages, brandManagerUtilities, entities, other]
};

export default menuItems;
