import axios from 'axios';

class boxItemService {
  async getBoxItem(boxId) {
    try {
      const response = await axios.get(
        `https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/BoxItem?boxId=${boxId}&pageNumber=1&pageSize=10`
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }

  async createBoxItem(boxId, fontId, fontSize, textFormat, boxItemType, boxColor) {
    const reqBody = {
      boxId: boxId,
      fontId: fontId,
      fontSize: fontSize,
      textFormat: textFormat,
      boxItemType: boxItemType,
      boxColor: boxColor
    };

    try {
      const response = await axios.post('https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/BoxItem', reqBody);

      const result = response.data.boxItemId;

      return result;
    } catch (error) {
      console.log('Error message: ' + JSON.stringify(error));
    }
  }

  async updateBoxItem(boxId, fontId, fontSize, textFormat, boxItemType, boxColor) {
    const reqBody = {
      fontId: fontId,
      fontSize: fontSize,
      textFormat: textFormat,
      boxItemType: boxItemType,
      boxColor: boxColor
    };

    try {
      const response = await axios.put(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/BoxItem/${boxId}`, reqBody);

      console.log('Resposne update box item: ' + JSON.stringify(response.data));
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }

  deleteBoxItem(id) {
    try {
      const response = axios.delete(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/BoxItem/${id}`);
      console.log('Api message: ' + response.data);
    } catch (error) {
      console.log('Error message: ' + error);
    }
  }
}

export default boxItemService;
