export default interface Portfolio {
  _id: string;
  author: {
    _id: string;
    image: string;
    firstName: string;
    lastName: string;
    
  };
  title: string;
  images: [string];
  thumbnail: string;
  description: string;
  role: string;
  skills: [string];
}
