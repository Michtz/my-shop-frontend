import { FC } from 'react';
import AuthManager from '@/components/AuthManager';
import ProfileContainer from '@/components/containers/ProfileContainer';

const LoginPage: FC = () => <ProfileContainer view={'login'} />;

export default LoginPage;
