import { axiosInstance } from '@/requests/base.request';
import { authApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';
import { UserInformation, User } from '@/types/auth';

export const updateUserInfo = async (
  userInfo: UserInformation,
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${authApiUrl}/change-user-info`,
      { userInfo },
      {
        withCredentials: true,
      },
    );
    console.log(response.data);
    return response;
  } catch (e) {
    Logger.error('Unable to logout');
    throw e;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${authApiUrl}/change-password`,
      { oldPassword, newPassword },
      {
        withCredentials: true,
      },
    );
    console.log(response.data);
    return response;
  } catch (e) {
    Logger.error('Unable to change password');
    throw e;
  }
};
