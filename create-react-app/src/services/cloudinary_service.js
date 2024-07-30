import axios from 'axios';

class cloudinaryService {
  async getAllImages(tag) {
    const cloudName = 'dchov8fes';
    try {
      const response = await axios.get(`https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`);

      const data = response.data;
      console.log('Data service: ', data);
      //   console.log('Response get image:', JSON.stringify(response.data));
      return data;
    } catch (error) {
      console.log('Error while get image from cloudinary', error);
    }
  }
}

export default cloudinaryService;
