export interface UserEvent {
    room: string;
    tsin: {
        seconds: number;
    };
    tsout: {
        seconds: number;
    };
    uid: string;
  }