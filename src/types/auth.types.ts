export interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginRequestBody {
    email: string;
    password: string;
  }
  
  export interface User {
    _id: string; 
    username: string;
    email: string;
  }
  
  export interface LoginResponse {
    user: User;
    token: string;
  }