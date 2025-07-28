import { axiosInstance } from '@/requests/base.request';
import { authApiUrl } from '@/config/api.config';
import { Logger } from '@/utils/Logger.class';
import { UserInformation } from '@/types/auth';

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
  currentPassword: string,
  newPassword: string,
): Promise<any> => {
  try {
    console.log('🔐 Changing password with data:', {
      currentPassword: currentPassword ? 'PROVIDED' : 'MISSING',
      newPassword: newPassword ? 'PROVIDED' : 'MISSING'
    });
    
    const response = await axiosInstance.post(
      `${authApiUrl}/change-password`,
      { currentPassword, newPassword },
      {
        withCredentials: true,
      },
    );
    
    console.log('🔐 Password change response:', response.data);
    return response;
  } catch (e) {
    console.error('🔐 Password change error:', e);
    Logger.error('Unable to change password');
    throw e;
  }
};
