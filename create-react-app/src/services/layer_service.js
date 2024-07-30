import axios from 'axios';

class layerService {
  async getLayer(templateId) {
    try {
      const response = await axios.get(
        `https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Layers?templateId=${templateId}&pageNumber=1&pageSize=10`
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }

  async createLayer(templateID, layerName, layerType) {
    const reqBody = {
      templateID: templateID,
      layerName: layerName,
      layerType: layerType
    };

    try {
      const response = await axios.post('https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Layers', reqBody);

      const layerId = response.data.layerId;

      return layerId;
    } catch (error) {
      console.log('Error message: ' + error);
    }
  }

  async updateLayer(layerName, layerId) {
    const reqBody = {
      layerName: layerName
    };

    try {
      const response = await axios.put(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Layers/${layerId}`, reqBody);

      console.log('Resposne message: ' + response.data);
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }

  deleteLayer(id) {
    try {
      const response = axios.delete(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Layers/${id}`);
      console.log('Api message: ' + response.data);
    } catch (error) {
      console.log('Error message: ' + error);
    }
  }
}

export default layerService;
