export interface UserProfileData {
  id: string;
  name: string;
  email: string;
}

export const mockUser: UserProfileData = {
  id: 'usr_101',
  name: 'Sample User',
  email: 'user@example.com',
};
