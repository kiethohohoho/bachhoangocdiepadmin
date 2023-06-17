// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

export type IUserProfileFollowers = {
  follower: number;
  following: number;
};

export type IUserProfileCover = {
  name: string;
  cover: string;
  role: string;
};

export type IUserProfileAbout = {
  quote: string;
  country: string;
  email: string;
  role: string;
  company: string;
  school: string;
};

export type IUserProfile = IUserProfileFollowers &
  IUserProfileAbout & {
    id: string;
    socialLinks: IUserSocialLink;
  };

export type IUserProfileFollower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  postAt: Date | string | number;
  imageUrl: string;
};

export type IUserProfileFriend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type IUserProfilePost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date | string | number;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date | string | number;
    message: string;
  }[];
};

// ----------------------------------------------------------------------

export type IUserCard = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPosts: number;
  role: string;
};

// ----------------------------------------------------------------------

export type IUserAccountGeneral = {
  Id: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  DateOfBirth?: string;
  Gender?: boolean;
  PhoneNumber: string;
  Email: string;
  UserName: string;
  Password: string;
  AccumulatedPoints?: number;
  Avatar?: string;
  IsAdmin?: true;
  IsEmailVerified?: true;
  OTPPhoneVerified?: string;
  IsPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type IUserAccountBillingCreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type IUserAccountBillingInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};

export type IUserAccountBillingAddress = {
  Id: string;
  AccountId: string;
  Name: string;
  IsDefault: true;
  City: string;
  CityGHNId?: string | number;
  District: string;
  DistrictGHNId?: string | number;
  Ward: string;
  WardGHNId?: string | number;
  Street?: string;
  ReceiverName: string;
  ReceiverPhoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

// ----------------------------------------------------------------------

export type IUserAccountNotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};
