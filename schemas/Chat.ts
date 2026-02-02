export interface Chat {
  _id: string;
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
    role: string;
  };
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
    role: string;
  };
  lastMessage: string;
}
