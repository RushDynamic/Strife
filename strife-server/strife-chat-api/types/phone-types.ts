export interface IceCandidate {
  candidate: any;
  receiver: string;
  sender?: string;
}

export interface CommData {
  caller: string;
  receiver: string;
}

export interface OfferData extends CommData {
  offer: { sdp: any; type: any };
}

export interface AnswerData extends CommData {
  answer: RTCSessionDescriptionInit;
}
