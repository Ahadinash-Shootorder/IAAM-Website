import Footer from '@/components/FooterNew';
import ProfilePage from '@/components/ProfilePage';

export const metadata = {
  title: 'My Profile | IAAM',
  description: 'Manage your IAAM membership profile',
};

export default function ProfileRoute() {
  return (
  <>
    <ProfilePage />
    <Footer />
  </>
  );
}