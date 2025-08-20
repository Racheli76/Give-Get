export type TalentRequestType = {
  id: number;
  userName: string;
  userId: number;
  talentName: string;
  parentCategory: string;
  requestDate: string;
}

export type TopUserType = {
  userName: string;
  score: number;
  desc: string;
  profileImageUrl: string;
}

export type TalentUserDtoType = {
  talentId: number;
  isOffered: boolean;
};

export type TalentUserType ={
  id: number;
  talentId: number;
  isOffered: boolean;
}

export type TalentType ={
  id: number;
  talentName: string;
  parentCategory: number;
  subTalents?: TalentType[]; 
  isOffered: boolean; 
}


export type MessageType = {
  fromId: number;
  text: string;
  time: string;
}

export type HeaderFooterPropsType ={
  children: React.ReactNode;
}

export type CommentType  = {
  id: number;
  userId: number;
  userName: string;
  content: string;
  profileImage: string;
}

export type ChatBoxPropsType ={
  userId: number;
  exchangeId: number;
  otherUserId: number; 
}

export type UserType = {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  score: number;
  talentsOffered: TalentUserDtoType[];  // עדכון לסוג המתאים
  talentsWanted: TalentUserDtoType[];   // עדכון לסוג המתאים
  age: string;
  gender: 'Male' | 'Female';
  desc: string;
  isActive: boolean;
  profileImage: string;
  isAdmin: boolean | null;
};

export type ProfileDetailsProps = {
  user: UserType;
}