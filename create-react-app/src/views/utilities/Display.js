import { useEffect, useState } from 'react';
import menuService from 'services/menu_service';
import storeDeviceService from 'services/store_device_service';
import templateService from 'services/template_service';
import displayService from 'services/display_service';
import { IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DevicesIcon from '@mui/icons-material/Devices';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CircularProgress from '@mui/material/CircularProgress';
import '../../assets/scss/display.scss'; // Import the CSS file
import { useParams } from 'react-router';

const Display = () => {
  const { templateId } = useParams();
  const [menus, setMenus] = useState([]);
  const [storeDevices, setStoreDevices] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuDetails, setMenuDetails] = useState(null); // State for menu details
  const [selectedStoreDevice, setSelectedStoreDevice] = useState(null);
  const [storeDeviceDetails, setStoreDeviceDetails] = useState(null); // State for store device details
  const [showPopup, setShowPopup] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0); // To manage which popup is shown
  const [loading, setLoading] = useState(false); // Loading state
  // const [displayDetails, setDisplayDetails] = useState(null); // State for display details popup
  const [template, setTemplate] = useState('');
  const menu_service = new menuService();
  const store_device = new storeDeviceService();
  const template_service = new templateService();
  const display_service = new displayService();

  useEffect(() => {
    getAllMenus();
    getAllStoreDevice();
    getTemplate();
  }, []);

  useEffect(() => {
    if (menus.length > 0) {
      setSelectedMenu(menus[0].menuId);
    }

    if (storeDevices.length > 0) {
      setSelectedStoreDevice(storeDevices[0].storeDeviceId);
    }
  }, [menus, storeDevices]);

  const getTemplate = async () => {
    await template_service.getTemplate(templateId).then((data) => {
      setTemplate(data);
    });
  };

  const getAllMenus = async () => {
    await menu_service.getAllByBrand(1).then((data) => {
      setMenus(data);
    });
  };

  const getAllStoreDevice = async () => {
    await store_device.getAllStoreDevice().then((data) => {
      setStoreDevices(data);
    });
  };

  const handleMenuChange = async (e) => {
    const menuId = Number(e.target.value);
    setSelectedMenu(menuId);
    fetchMenuDetails(menuId); // Fetch and set menu details
  };

  const handleStoreDeviceChange = async (e) => {
    const storeDeviceId = Number(e.target.value);
    setSelectedStoreDevice(storeDeviceId);
    fetchStoreDeviceDetails(storeDeviceId); // Fetch and set store device details
  };

  const fetchMenuDetails = (menuId) => {
    // Sample data for menu details
    const sampleMenuDetails = {
      1: {
        name: 'Sample Menu 1',
        description: 'This is a description for Sample Menu 1.',
        items: [
          { name: 'Item 1', price: '$10' },
          { name: 'Item 2', price: '$15' }
        ]
      },
      2: {
        name: 'Sample Menu 2',
        description: 'This is a description for Sample Menu 2.',
        items: [
          { name: 'Item A', price: '$12' },
          { name: 'Item B', price: '$18' }
        ]
      }
    };
    setMenuDetails(sampleMenuDetails[menuId]);
  };

  const fetchStoreDeviceDetails = (storeDeviceId) => {
    // Sample data for store device details
    const sampleStoreDeviceDetails = {
      1: {
        name: 'Store Device 1',
        location: 'Location 1',
        status: 'Active'
      },
      2: {
        name: 'Store Device 2',
        location: 'Location 2',
        status: 'Inactive'
      }
    };
    setStoreDeviceDetails(sampleStoreDeviceDetails[storeDeviceId]);
  };

  const handleHourChange = (event) => {
    setHour(Number(event.target.value));
  };

  const handleMinuteChange = (event) => {
    setMinute(Number(event.target.value));
  };

  const handleSecondChange = (event) => {
    setSecond(Number(event.target.value));
  };

  const createDisplay = async () => {
    setLoading(true);
    await display_service
      .createDisplay(selectedStoreDevice, selectedMenu, templateId, 23.99)
      .then((data) => {
        const displayId = data.displayId;
        const link = `https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Displays/V2/${displayId}/image`;
        console.log('link: ', link);
        console.log('Display response: ', data);
        // setDisplayDetails({
        //   menu: menuDetails,
        //   storeDevice: storeDeviceDetails,
        //   time: `${hour}h ${minute}m ${second}s`
        // });
        setLoading(false);
        // setTimeout(() => setShowPopup('displayDetails'), 2000);
        setTemplate(link);
      })
      .catch((error) => {
        console.log('Error while creating display: ', error.message);
        setLoading(false);
      });
  };

  const openPopup = (type) => {
    setShowPopup(type);
  };

  const closePopup = () => {
    setShowPopup(null);
  };

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )}
      <div className="sidebar">
        <Tooltip title="Menu">
          <IconButton className="icon-button" onClick={() => openPopup('menu')}>
            <MenuIcon className="menu-icon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Store Device">
          <IconButton className="icon-button" onClick={() => openPopup('storeDevice')}>
            <DevicesIcon className="device-icon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Active Hour">
          <IconButton className="icon-button" onClick={() => openPopup('hour')}>
            <AccessTimeIcon className="hour-icon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create Display">
          <IconButton className="create-display-btn" onClick={createDisplay}>
            <AddBoxIcon className="create-display-icon" />
          </IconButton>
        </Tooltip>

        {showPopup === 'menu' && (
          <div className="popup show">
            <div className="popup-content">
              <label htmlFor="menuSelect">Select Menu:</label>
              <select id="menuSelect" onChange={handleMenuChange}>
                {menus.map((menu) => (
                  <option key={menu.menuId} value={menu.menuId}>
                    {menu.menuName}
                  </option>
                ))}
              </select>
              {menuDetails && (
                <div className="menu-details">
                  <h3>{menuDetails.name}</h3>
                  <p>{menuDetails.description}</p>
                  <ul>
                    {menuDetails.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}

        {showPopup === 'storeDevice' && (
          <div className="popup show">
            <div className="popup-content">
              <label htmlFor="deviceSelect">Select Store Device:</label>
              <select id="deviceSelect" onChange={handleStoreDeviceChange}>
                {storeDevices.map((device) => (
                  <option key={device.storeDeviceId} value={device.storeDeviceId}>
                    {device.storeDeviceName}
                  </option>
                ))}
              </select>
              {storeDeviceDetails && (
                <div className="store-device-details">
                  <h3>{storeDeviceDetails.name}</h3>
                  <p>Location: {storeDeviceDetails.location}</p>
                  <p>Status: {storeDeviceDetails.status}</p>
                </div>
              )}
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}

        {showPopup === 'hour' && (
          <div className="popup show">
            <div className="popup-content">
              <label htmlFor="hourInput">Enter Time:</label>
              <div className="time-inputs">
                <input
                  type="number"
                  id="hourInput"
                  name="hourInput"
                  min="0"
                  max="23"
                  value={hour}
                  onChange={handleHourChange}
                  className="time-input"
                  placeholder="HH"
                />
                <input
                  type="number"
                  id="minuteInput"
                  name="minuteInput"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={handleMinuteChange}
                  className="time-input"
                  placeholder="MM"
                />
                <input
                  type="number"
                  id="secondInput"
                  name="secondInput"
                  min="0"
                  max="59"
                  value={second}
                  onChange={handleSecondChange}
                  className="time-input"
                  placeholder="SS"
                />
              </div>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}

        {showPopup === 'displayDetails' && (
          <div className="popup show">
            <div className="popup-content">
              <h3>Display Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Menu</td>
                    <td>
                      {displayDetails.menu.name}
                      <ul>
                        {displayDetails.menu.items.map((item, index) => (
                          <li key={index}>
                            {item.name} - {item.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>Store Device</td>
                    <td>
                      {displayDetails.storeDevice.name}
                      <p>Location: {displayDetails.storeDevice.location}</p>
                      <p>Status: {displayDetails.storeDevice.status}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>Time</td>
                    <td>{displayDetails.time}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
      </div>

      <div className="content">
        <div className="template">
          <img src={template} alt="template" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
};

export default Display;
