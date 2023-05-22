import { Button } from '@mantine/core';
import {
    IconLogin,
    IconLogout,
    IconUser,
    IconUserShield,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminButton() {
  return (
    <Link to="/admin" style={buttonStyling} data-cy="admin-link">
      <Button size="xs" variant="subtle" radius="xl">
        <IconUserShield size="1.8rem" stroke="1.3" />
      </Button>
    </Link>
  );
}

export function SignInButton() {
  return (
    <Link to="/signin" style={buttonStyling}>
      <Button size="xs" variant="subtle" radius="xl">
        <IconLogin size="1.8rem" stroke="1.3" />
      </Button>
    </Link>
  );
}

export function UserButton() {
  return (
    <Link to="/orders" style={buttonStyling}>
      <Button size="xs" variant="subtle" radius="xl">
        <IconUser size="1.8rem" stroke="1.3" />
      </Button>
    </Link>
  );
}

export function SignOutButton() {
  //Behöver ändras senare
  const { setIsSignedIn } = useAuth();
  const handleSignOut = () => {
    setIsSignedIn(false);
  };
  //------------

  return (
    <Link to="/" style={buttonStyling}>
      <Button size="xs" variant="subtle" radius="xl" onClick={handleSignOut}>
        <IconLogout size="1.8rem" stroke="1.3" />
      </Button>
    </Link>
  );
}

const buttonStyling = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};
