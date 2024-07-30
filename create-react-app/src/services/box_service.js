import axios from 'axios';

class boxService {
  async getBox(layerId) {
    try {
      const response = await axios.get(
        `https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Boxes?layerId=${layerId}&pageNumber=1&pageSize=100`
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }

  async createBox(layerId, boxPositionX, boxPositionY, boxWidth, boxHeight, boxType, boxMaxCapacity) {
    const reqBody = {
      layerId: layerId,
      boxPositionX: boxPositionX,
      boxPositionY: boxPositionY,
      boxWidth: boxWidth,
      boxHeight: boxHeight,
      boxType: boxType,
      boxMaxCapacity: boxMaxCapacity
    };

    try {
      const response = await axios.post('https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Boxes', reqBody);

      const boxId = response.data.boxId;

      return boxId;
    } catch (error) {
      console.log('Error message: ' + error);
    }
  }

  async updateBox(boxId, boxPositionX, boxPositionY, boxWidth, boxHeight, boxMaxCapacity) {
    const reqBody = {
      boxPositionX: boxPositionX,
      boxPositionY: boxPositionY,
      boxWidth: boxWidth,
      boxHeight: boxHeight,
      boxMaxCapacity: boxMaxCapacity
    };

    try {
      const response = await axios.put(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Boxes/${boxId}`, reqBody);
      return response.data;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }
  async deleteBox(id) {
    try {
      const response = await axios.delete(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Box/${id}`);
      console.log('Api message: ' + response.data);
    } catch (error) {
      console.log('Error message: ' + error);
    }
  }
}

export default boxService;
