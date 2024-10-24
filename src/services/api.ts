import { auth } from '@/config/firebaseConfig';

export const fetchGeneralLogin = async (idToken: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (response.status === 404) {
    throw new Error('User not found');
  }
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return response.json();
};

export const fetchGoogleLogin = async (idToken: string) => {
  const response = await fetch('/api/auth/googleLogin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (response.status === 404) {
    throw new Error('User not found');
  }
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return response.json();
};

export const fetchSignUp = async (idToken: string) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (response.status === 409) {
    throw new Error('User already exists');
  }

  if (!response.ok) {
    throw new Error('Failed to sign up');
  }
  return response.json();
};

export const fetchUserTrips = async () => {
  try {
    const response = await fetch('/api/user/trips', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }

    const trips = await response.json();
    return trips;
  } catch (error) {
    console.error('Error fetching trips:', error);
  }
};

export const fetchUserArticles = async () => {
  try {
    const response = await fetch('/api/user/articles', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    const articles = await response.json();
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

export const fetchUserData = async () => {
  try {
    const response = await fetch('/api/auth/verifyToken', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      return data.userData;
    } else {
      console.error('Failed to fetch user data');
      return null;
    }
  } catch (error) {
    console.error('Failed to verifyToken', error);
  }
};

export const refreshAuthToken = async (): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    try {
      const idToken: string = await user.getIdToken(true);
      const response = await fetch('/api/auth/updateToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to update token');
      }
    } catch (error) {
      console.error('Failed to refresh token', error);
    }
  } else {
    console.error('No user is logged in');
  }
};
