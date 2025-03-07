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

  export interface Call {
    _id: string;
    participants: string[]; 
    startTime: Date;
    endTime?: Date;
    createdAt: Date;
    updatedAt: Date;
  }