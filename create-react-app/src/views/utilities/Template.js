import React, { useState, useEffect } from 'react';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import '../../assets/scss/template.scss';

import { Button } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ImageIcon from '@mui/icons-material/Image';
import CldImage from 'ui-component/CldImage';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import html2canvas from 'html2canvas';
import axios from 'axios';

import boxService from 'services/box_service';
import layerService from 'services/layer_service';
// import templateService from 'services/template_service';
import boxItemService from 'services/box_item_service';
import layerItemService from 'services/layer_item_service';
import fontService from 'services/font_service';
import cloudinaryService from 'services/cloudinary_service';
import { useParams } from 'react-router';
function Template() {
  const { templateId } = useParams();
  const [activeTab, setActiveTab] = useState(null);
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState('#35363a');
  const [fontSize, setFontSize] = useState(20);
  // const [templateId, setTemplateId] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fonts, setFonts] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState('green');
  const [assetImage, setAssetImage] = useState([]);
  // const [isBold, setIsBold] = useState(false);
  // const [isItalic, setIsItalic] = useState(false);

  const box_service = new boxService();
  const layer_service = new layerService();
  // const template_service = new templateService();
  const box_item_service = new boxItemService();
  const layer_item_service = new layerItemService();
  const font_service = new fontService();
  const cloudinary_service = new cloudinaryService();

  // const cloudName = import.meta.env.VITE_CLOUD_NAME;
  // const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  const cloudName = 'dchov8fes';
  const uploadPreset = 'ml_default';

  const handleTabClick = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const getImages = async (tag) => {
    try {
      const images = await cloudinary_service.getAllImages(tag);

      setAssetImage(images);

      return images;
    } catch (error) {
      console.log('Error message: ', error.message);
    }
  };

  // const getBackgroundImages = async (tag) => {
  //   try {
  //     const images = await cloudinary_service.getAllImages(tag);

  //     setAssetImage(images);

  //     return images;
  //   } catch (error) {
  //     console.log('Error message: ', error.message);
  //   }
  // };

  const getAllFont = async () => {
    try {
      await font_service.getAll().then((value) => {
        setFonts(value);
        console.log('Fonts: ', fonts);
      });
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  // const createUserTemplate = async () => {
  //   try {
  //     const id = await template_service.createTemplate(
  //       2,
  //       'Demo',
  //       'Demo description',
  //       1280,
  //       720,
  //       'https://t4.ftcdn.net/jpg/05/56/81/55/360_F_556815523_AYrXaaLIUESVAphY1jQ02wGJ5M8qMtTs.jpg'
  //     );

  //     setTemplateId(id);
  //     return id;
  //   } catch (error) {
  //     console.log('Error message: ' + error.message);
  //   }
  // };

  const createLayer = async (layerType) => {
    try {
      const id = await layer_service.createLayer(templateId, 'LayerName', layerType);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const createLayerItem = async (layerId, layerItemValue) => {
    try {
      const id = await layer_item_service.createLayerItem(layerId, layerItemValue);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const createBox = async (layerId, boxType) => {
    try {
      const id = await box_service.createBox(layerId, 200, 200, 200, 200, boxType, 100);

      // setBoxId(id);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const createBoxItem = async (boxId, textFormat, boxItemType) => {
    try {
      const id = await box_item_service.createBoxItem(boxId, 8, 20, textFormat, boxItemType, '#FFFFFF');

      return id;
    } catch (error) {
      console.log('Error message: ' + JSON.stringify(error.message));
    }
  };

  const updateLayerItem = async (layerItemType, layerItemValue, layerItemId) => {
    try {
      const response = await layer_item_service.updateLayerItem(layerItemType, layerItemValue, layerItemId);

      console.log('Response: ', JSON.stringify(response));
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const updateBox = async (boxId, boxPositionX, boxPositionY, boxWidth, boxHeight, boxMaxCapacity) => {
    try {
      const response = await box_service.updateBox(boxId, boxPositionX, boxPositionY, boxWidth, boxHeight, boxMaxCapacity);

      console.log('Response update box: ', JSON.stringify(response));
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const updateBoxItem = async (boxId, fontId, fontSize, textFormat, boxItemType, boxColor) => {
    try {
      await box_item_service.updateBoxItem(boxId, fontId, fontSize, textFormat, boxItemType, boxColor);

      // console.log('Response update box item: ', JSON.stringify(response));
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  useEffect(() => {
    // createUserTemplate();
    console.log('template id: ', templateId);
    getAllFont();
    getImages('asset/images');

    document.addEventListener('keydown', detectKeydown);

    const uwScript = document.getElementById('uw');
    if (!loaded && !uwScript) {
      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('id', 'uw');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.addEventListener('load', () => setLoaded(true));
      document.body.appendChild(script);
    }
  }, []);

  // const detectKeydown = (e) => {
  //   console.log('key: ', e.key);
  // };

  const detectKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (e.shiftKey) {
        // Redo (Ctrl + Shift + Z or Cmd + Shift + Z)
        console.log('Redo action');
        // Implement your redo functionality here
      } else {
        // Undo (Ctrl + Z or Cmd + Z)
        console.log('Undo action');
        // Implement your undo functionality here
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      // Redo (Ctrl + Y or Cmd + Y)
      console.log('Redo action');
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      // removeSelectedObject();
      // if (editor.canvas.getActiveObject()) {
      //   console.log('Delete');
      // }

      console.log('Do nothing');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      // Copy();
      console.log('Copy action');
      // Implement your copy functionality here
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      // Paste();
      console.log('Paste action');
    } else {
      // console.log('key: ', e.key);
    }
  };

  // function Copy() {
  //   // clone what are you copying since you
  //   // may want copy and paste on different moment.
  //   // and you do not want the changes happened
  //   // later to reflect on the copy.
  //   editor.canvas.getActiveObject().clone(function (cloned) {
  //     _clipboard = cloned;
  //   });
  // }

  // function Paste() {
  //   // clone again, so you can do multiple copies.
  //   _clipboard.clone(function (clonedObj) {
  //     canvas.discardActiveObject();
  //     clonedObj.set({
  //       left: clonedObj.left + 10,
  //       top: clonedObj.top + 10,
  //       evented: true
  //     });
  //     if (clonedObj.type === 'activeSelection') {
  //       // active selection needs a reference to the canvas.
  //       clonedObj.canvas = canvas;
  //       clonedObj.forEachObject(function (obj) {
  //         canvas.add(obj);
  //       });
  //       // this should solve the unselectability
  //       clonedObj.setCoords();
  //     } else {
  //       canvas.add(clonedObj);
  //     }
  //     _clipboard.top += 10;
  //     _clipboard.left += 10;
  //     canvas.setActiveObject(clonedObj);
  //     canvas.requestRenderAll();
  //   });
  // }

  // const undo = () => {
  //   if (editor.canvas._objects.length > 0) {
  //     history.push(editor.canvas._objects.pop());
  //   }
  //   editor.canvas.renderAll();
  // };
  // const redo = () => {
  //   if (history.length > 0) {
  //     editor.canvas.add(history.pop());
  //   }
  // };

  // const removeSelectedObject = () => {
  //   editor.canvas.remove(editor.canvas.getActiveObject());
  // };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight('100%');
    editor.canvas.setWidth('100%');
    editor.canvas.renderAll();
    // createUserTemplate();
  }, []);

  // const addBackgroundImage = (file) => {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     fabric.Image.fromURL(e.target.result, (img) => {
  //       img.scale(0.75);
  //       img.scaleX = editor.canvas.width / img.width;
  //       img.scaleY = editor.canvas.height / img.height;
  //       editor.canvas.add(img);
  //       editor.canvas.renderAll();
  //     });
  //   };
  //   reader.readAsDataURL(file);
  // };

  // const handleBackgroundImageUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // const url = URL.createObjectURL(file);

  //     addBackgroundImage(file);
  //     // console.log('File url:', url);
  //     // console.log('File Name:', file.name);
  //     // console.log('File Type:', file.type);
  //     // console.log('File Size:', file.size);
  //     const layerId = await createLayer(templateId, 'BackGroundImage', 0);
  //     const layerItemId = await createLayerItem(layerId, file.name);
  //     console.log('layerId: ', layerId);
  //     console.log('layerItemId: ', layerItemId);
  //   }
  // };

  const addImage = (file, boxId) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        const myImg = img.set({
          // width: 200,
          // height: 100,
          selectable: true, // Make sure the image is selectable
          evented: true,
          scaleX: 0.5,
          scaleY: 0.5
        });

        // myImg.on('mouse:down', function () {
        //   console.log('sdads');
        // });

        // console.log('width: ', myImg.width, 'height: ', myImg.height);
        // img.scale(0.75);

        // bindImageEvents(myImg);

        myImg.on('modified', function () {
          console.log('Left: ' + myImg.left + ' Top: ' + myImg.top);
          console.log('Width: ' + myImg.getScaledWidth() + ' Height: ' + myImg.getScaledHeight());
          updateBox(boxId, myImg.left, myImg.top, myImg.getScaledWidth(), myImg.getScaledHeight(), 100);
        });

        editor.canvas.add(myImg);
        editor.canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  // function bindImageEvents(imageObject) {
  //   imageObject.on('mousedown', function () {
  //     // console.log('width: ', imageObject.width, 'height: ', imageObject.height);
  //     // console.log('left: ', imageObject.left, 'top: ', imageObject.top);
  //   });

  //   imageObject.on('modified', function () {
  //     console.log('Left: ' + imageObject.left + ' Top: ' + imageObject.top);
  //     console.log('Width: ' + imageObject.getScaledWidth() + ' Height: ' + imageObject.getScaledHeight());
  //     updateBox();

  //   });
  // }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    const preset_key = 'xdm798lx';
    if (file) {
      // const url = URL.createObjectURL(file);
      formData.append('file', file);
      formData.append('upload_preset', preset_key);

      axios.post('https://api.cloudinary.com/v1_1/dchov8fes/image/upload', formData).then(async (result) => {
        const layerItemValue = result.data.secure_url;
        const layerId = await createLayer(1);
        const layerItemId = await createLayerItem(layerId, layerItemValue);
        await createBox(layerId, 0).then((boxId) => {
          addImage(file, boxId);
        });
        console.log('layerId: ', layerId);
        console.log('layerItemId: ', layerItemId);

        // console.log('Response from cloudinary when upload image:', JSON.stringify(layerItemValue));
      });
      // addImage(file, boxId);
      // uploadWidget();
    }
  };

  const changeBackgroundColor = (e) => {
    const newColor = e.target.value;
    setBackgroundColor(newColor);
    console.log(newColor);
    const activeObject = editor.canvas.getActiveObject();

    activeObject.set('fill', newColor);
    // editor.canvas.backgroundColor = newColor;
    editor.canvas.renderAll();
  };

  const changeFontSize = (e) => {
    const newFontSize = e.target.value;
    setFontSize(newFontSize);
    console.log('FontSize: ', newFontSize);

    const activeObject = editor.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('fontSize', newFontSize);
      activeObject.fire('modified');
      editor.canvas.renderAll();
    }
  };

  const changeColor = (e) => {
    setColor(e.target.value);
    console.log(color);
    const o = editor.canvas.getActiveObject();
    o.set('fill', color);
    editor?.setStrokeColor(color);
    o.fire('modified');
    editor.canvas.renderAll();
  };

  const isBold = () => {
    const o = editor.canvas.getActiveObject();
    if (o) {
      const currentFontWeight = o.get('fontWeight');
      o.set('fontWeight', currentFontWeight === 'bold' ? 'normal' : 'bold');
      editor.canvas.renderAll();
    }
  };

  const isItalic = () => {
    const o = editor.canvas.getActiveObject();
    if (o) {
      const currentFontStyle = o.get('fontStyle');
      o.set('fontStyle', currentFontStyle === 'italic' ? 'normal' : 'italic');
      editor.canvas.renderAll();
    }
  };

  const addText = async (title) => {
    console.log(title);
    setColor(color);
    const text = new fabric.Textbox('Text', {
      top: 300,
      left: 300,
      fill: color,
      width: 100,
      fontSize: fontSize,
      height: 50,
      backgroundColor: 'transparent',
      fontStyle: 'normal',
      fontWeight: null
    });

    editor.canvas.add(text);

    const layerId = await createLayer(3);
    const layerItemId = await createLayerItem(layerId, 'Text');
    const boxId = await createBox(layerId, 0);
    const boxItemId = await createBoxItem(boxId, 1, 0);

    console.log('Layer id: ', layerId);
    console.log('layer item id: ', layerItemId);
    console.log('Box id: ', boxId);
    console.log('Box item id: ', boxItemId);

    // editor.canvas.requestRenderAll();

    text.on('object:modified', function () {
      // console.log('Text changed to: ', text.text);
      console.log('font size', text.fontSize);
      // console.log('Left: ' + text.left + ' Top: ' + text.top);
      // console.log('Box id: ', boxId);
      // console.log('Layer id: ', layerId);
      // console.log('Box item id: ', boxItemId);
      // console.log('Layer item id: ', layerItemID);
    });

    text.on('modified', function () {
      // console.log('Left: ' + text.left + ' Top: ' + text.top);
      // console.log('Text changed to: ', text.text);
      // console.log('Color: ', text.fill);
      // console.log('Width: ', text.width);
      // console.log('Height: ', text.height);
      // console.log('Font size: ', text.fontSize);
      updateLayerItem(3, text.text, layerItemId);
      updateBox(boxId, text.left, text.top, text.width, text.height, 100);
      updateBoxItem(boxItemId, 8, text.fontSize, 1, 0, text.fill);
    });

    text.on('resizing', function () {
      console.log('asddsa');
      console.log('width: ', text.width, 'height: ', text.height);
    });

    text.on('object:selected', function (options) {
      options.target.bringToFront();
    });

    // console.log('Widdth: ', text.width, 'Height: ', text.height);
    editor.canvas.renderAll();
  };

  const addRenderLayer = async () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: backgroundColor,
      borderColor: 'dark',
      width: 200,
      height: 200,
      selectionBackgroundColor: 'black'
    });

    editor.canvas.add(rect);
    let width = rect.width;
    let height = rect.height;

    const layerId = await createLayer(2);
    const boxId = await createBox(layerId, 1);
    const box1 = await createBoxItem(boxId, 1, 0);
    const box2 = await createBoxItem(boxId, 0, 1);
    console.log('width: ', width, 'height: ', height);
    console.log('Layer id: ', layerId);
    console.log('Box id: ', boxId);
    console.log('Box item id 1: ', box1);
    console.log('Box item id 2: ', box2);

    rect.on('modified', function () {
      updateBox(boxId, rect.left, rect.top, width, height, 100);
      console.log('width: ', width, 'height: ', height);
      // console.log('Left: ' + rect.left + ' Top: ' + rect.top);
    });

    rect.on('scaling', function () {
      width = rect.width * rect.scaleX;
      height = rect.height * rect.scaleY;
    });

    // editor.canvas.renderAll();
  };

  const addMenuCollection = async () => {
    console.log('Added Menu Collection');

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#FFC5CB',
      borderColor: 'dark',
      width: 200,
      height: 200,
      selectionBackgroundColor: 'black'
    });

    let width = rect.width;
    let height = rect.height;

    editor.canvas.add(rect);

    rect.on('modified', function () {
      updateBox(boxId, rect.left, rect.top, width, height, 100);
    });

    const layerId = await createLayer(4);
    const boxId = await createBox(layerId, 1);

    const boxItemId = await createBoxItem(boxId, 1, 0);
    console.log('Layer id: ', layerId);
    console.log('Box id: ', boxId);
    console.log('Box item id: ', boxItemId);

    rect.on('scaling', function () {
      width = rect.width * rect.scaleX;
      height = rect.height * rect.scaleY;
    });
  };

  const addBackgroundImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        img.scale(0.75);
        img.scaleX = editor.canvas.width / img.width;
        img.scaleY = editor.canvas.height / img.height;
        editor.canvas.add(img);
        editor.canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      addBackgroundImage(file);

      console.log('layerId: ', layerId);
      console.log('layerItemId: ', layerItemId);
    }
  };

  const processResults = async (error, result) => {
    if (result.event === 'close') {
      setIsDisabled(false);
    }
    if (result && result.event === 'success') {
      const layerId = await createLayer(templateId, 'BackGroundImage', 0);
      const layerItemId = await createLayerItem(layerId, result.info.secure_url);
      const boxId = await createBox(layerId, 200, 200, 300, 300, 0, 100);

      console.log('layerId: ', layerId);
      console.log('layerItemId: ', layerItemId);
      console.log('boxId: ', boxId);
      console.log('success');

      setIsDisabled(false);
    }
    if (error) {
      setIsDisabled(false);
    }
  };

  const uploadWidget = () => {
    // handleBackgroundImageUpload();
    setIsDisabled(true);
    window.cloudinary.openUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url'],
        // tags: ['myphotoalbum-react'],
        clientAllowedFormats: ['image'],
        resourceType: 'image'
      },
      processResults
    );
  };

  // const hanlderFontChange = (e) => {
  //   const value = e.target.value;

  //   setFonts(value);

  //   console.log(value);
  // };

  const clicked = () => {
    console.log('clicked image');
  };

  const updateTemplateImg = (templateId, data) => {
    try {
      axios.put(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Templates/${templateId}/image?TemplateImgPath=${data}`);
    } catch (error) {
      console.log('Failed to upload template image: ' + JSON.stringify(error));
    }
  };

  const takeScreenShot = () => {
    const preset_key = 'xdm798lx';
    const formData = new FormData();

    html2canvas(document.querySelector('.sample-canvas')).then(async (canvas) => {
      const base64 = canvas.toDataURL('image/png');
      // console.log('URL: ', base64);
      // const screenShot = base64Decoder(base64);
      // console.log('Screen Shot: ', screenShot);
      formData.append('file', base64);
      formData.append('upload_preset', preset_key);
      // console.log('Result ', canvas.toDataURL('image/png'));
      try {
        await axios
          .post(`https://api.cloudinary.com/v1_1/dchov8fes/image/upload`, formData)
          .then(async (result) => {
            const templateImg = result.data.url;
            updateTemplateImg(templateId, templateImg);
            // console.log('Response from cloudinary: ' + JSON.stringify(result.data.url));
          })
          .catch((error) => {
            console.log('Failed to upload to cloundinary: ' + error);
          });
      } catch (error) {
        console.log('Failed to upload to cloundinary: ' + error.toString());
      }
    });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Canva Clone: {templateId}</div>
        <label htmlFor="font-size">Font Size:</label>
        <input
          type="number"
          id="font-size"
          value={fontSize}
          onChange={changeFontSize}
          min="1" // Set minimum value if needed
          max="999" // Set maximum value if needed
        />
        <label htmlFor="font-color">Font Color:</label>
        <input type="color" id="font-color" onChange={(e) => changeColor(e)} />
        <button onClick={isBold}>B</button>
        <button onClick={isItalic}>I</button>
        <label htmlFor="font-color">Background Color:</label>
        <input type="color" id="font-color" onChange={(e) => changeBackgroundColor(e)} />
        {/* <select onChange={hanlderFontChange}> */}
        {/* <option value="">Select a font</option> */}
        {/* {fonts.slice(0, 2).map((font) => ( */}
        {/* // <option key={font.fontId} value={font.fontName}> */}
        {/* {font.fontName} */}
        {/* </option> */}
        {/* ))} */}
        {/* </select> */}
        <div className="actions">
          <button className="save-btn" onClick={takeScreenShot}>
            Save
          </button>
          {/* <button className="share-btn">Share</button> */}
          <div className="profile">User</div>
        </div>
      </header>
      {/* <div className="toolbar">
        <label htmlFor="font-size">Font Size:</label>
        <input
          type="number"
          id="font-size"
          value={fontSize}
          onChange={changeFontSize}
          min="1" // Set minimum value if needed
          max="999" // Set maximum value if needed
        />
        <label htmlFor="font-color">Font Color:</label>
        <input type="color" id="font-color" onChange={(e) => changeColor(e)} />
        <button>B</button>
        <button>I</button>
        <label htmlFor="font-color">Background Color:</label>
        <input type="color" id="font-color" onChange={(e) => changeBackgroundColor(e)} />
      </div> */}
      <div className="main">
        <div className="sidebar-container">
          <aside className="sidebar" style={{ marginLeft: '10%', borderRadius: '20px', marginTop: '10%' }}>
            <Button onClick={() => handleTabClick('text')} startIcon={<TextFieldsIcon />} style={{ color: 'white' }}>
              Text
            </Button>
            <Button onClick={() => handleTabClick('background')} startIcon={<ViewModuleIcon />} style={{ color: 'white' }}>
              Background
            </Button>
            <Button onClick={() => handleTabClick('images')} startIcon={<ImageIcon />} style={{ color: 'white' }}>
              Image
            </Button>

            <Button onClick={() => handleTabClick('renderLayer')} startIcon={<CloudUploadIcon />} style={{ color: 'white' }}>
              Render Layer
            </Button>
            <Button onClick={() => handleTabClick('menuCollection')} startIcon={<CloudUploadIcon />} style={{ color: 'white' }}>
              Menu Collection
            </Button>
          </aside>

          <div className={`tab-container ${activeTab ? 'open' : ''}`}>
            {activeTab === 'text' && (
              <div className="tab">
                <h4 style={{ color: 'white' }}>Text</h4>
                <button onClick={() => addText('Heading')}>Heading</button>
                <button onClick={() => addText('Subheading')}>Subheading</button>
                <button onClick={() => addText('Body Text')}>Body Text</button>
              </div>
            )}
            {activeTab === 'background' && (
              <div className="tab">
                <h4 style={{ color: 'white' }}>Background</h4>
                <input type="file" accept="image/*" onChange={handleBackgroundImageUpload} />
                <button
                  disabled={isDisabled}
                  className={`btn btn-primary ${isDisabled ? 'btn-disabled' : ''}`}
                  type="button"
                  onClick={uploadWidget}
                >
                  {isDisabled ? 'Opening Widget' : 'Upload Image'}
                </button>
              </div>
            )}
            {activeTab === 'images' && (
              <div className="tab narrow-tab" style={{ width: '100%' }}>
                <h4 style={{ color: 'white' }}>Image</h4>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <button
                  disabled={isDisabled}
                  className={`btn btn-primary ${isDisabled ? 'btn-disabled' : ''}`}
                  type="button"
                  onClick={uploadWidget}
                >
                  {isDisabled ? 'Đang mở ' : 'Tải ảnh lên'}
                </button>
                <div
                  className="custom-scrollbar"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'scroll',
                    maxHeight: '500px',
                    width: '100%',
                    paddingRight: '10px'
                  }}
                >
                  {assetImage.resources.map((photo, idx) => {
                    return (
                      <button
                        onClick={clicked}
                        style={{ background: 'none', border: 'none', marginBottom: '0px', padding: '0px' }}
                        key={idx}
                      >
                        {/* <img src={value} width="90%" height="auto" alt="" key="" style={{ margin: '5px', borderRadius: '10px' }} />; */}
                        <CldImage publicId={photo.public_id} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'renderLayer' && (
              <div className="tab">
                <h4 style={{ color: 'white' }}>Render Layer</h4>
                <button
                  onClick={() => {
                    addRenderLayer();
                  }}
                >
                  CREATE RENDER LAYER
                </button>
              </div>
            )}
            {activeTab === 'menuCollection' && (
              <div className="tab">
                <h4 style={{ color: 'white' }}>Menu Collection</h4>
                <button
                  onClick={() => {
                    addMenuCollection();
                  }}
                >
                  CREATE MENU COLLECTION
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={`canvas-area ${activeTab ? 'sidebar-open' : ''}`}>
          <div
            style={{
              width: '65%',
              height: '65%',
              background: '#f8f9fa',
              marginLeft: '10%'
            }}
          >
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template;
