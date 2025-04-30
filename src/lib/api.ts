import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const createApiAuth = (token: string) => {
	return axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})
}

type LoginInput = { email: string; password: string };
type RegisterInput = { email: string; password: string; nickname: string };

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
};

export type ErrorResponse = {
  code: string;
  message: string;
  details?: string;
};

export async function loginUser(data: LoginInput): Promise<TokenResponse> {
  try {
    const resp = await api.post<TokenResponse>('/auth/login', data);
    return resp.data;
  } catch (e) {
    if ((e as AxiosError).response) {
      const err = (e as AxiosError).response!.data as ErrorResponse;
      throw new Error(err.message || 'Login failed');
    }
    throw e;
  }
}

export async function registerUser(data: RegisterInput): Promise<void> {
  try {
    await api.post('/auth/register', data);
  } catch (e) {
    if ((e as AxiosError).response) {
      const err = (e as AxiosError).response!.data as ErrorResponse;
      throw new Error(err.message || 'Registration failed');
    }
    throw e;
  }
}

export async function getProfile(): Promise<{
  nickname: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
}> {
  try {
    const resp = await api.get('/profile/get');
    return resp.data;
  } catch (e) {
    if ((e as AxiosError).response) {
      const err = (e as AxiosError).response!.data as ErrorResponse;
      throw new Error(err.message || 'Could not fetch profile');
    }
    throw e;
  }
}

type UpdateInput = { nickname?: string; first_name?: string; last_name?: string}

export async function updateProfile(
	token: string,
	data: UpdateInput
): Promise<void> {
	const apiAuth = createApiAuth(token)
	try {
		const resp = await apiAuth.put('/profile/update', data)
		return resp.data
	} catch (e) {
		if ((e as AxiosError).response) {
			const err = (e as AxiosError).response!.data as ErrorResponse
			throw new Error(err.message || 'Profile update failed')
		}
		throw e
	}
}


interface UploadAvatarResponse {
	message: string
	profile_pic: string
}

export async function uploadAvatar(token: string, file: File): Promise<string> {
	const apiAuth = createApiAuth(token)
	const formData = new FormData()
	formData.append('avatar', file)

	try {
		const resp = await apiAuth.post<UploadAvatarResponse>(
			'/profile/upload-avatar',
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return resp.data.profile_pic 
	} catch (e) {
		if ((e as AxiosError).response) {
			const err = (e as AxiosError).response!.data as { message: string }
			throw new Error(err.message || 'Upload avatar failed')
		}
		throw e
	}
}

export async function deleteAvatar(token: string): Promise<void> {
	const apiAuth = createApiAuth(token)
	
	try {
		await apiAuth.delete('/profile/delete-avatar')
	} catch (e) {
		if ((e as AxiosError).response) {
			const err = (e as AxiosError).response!.data as { message: string }
			throw new Error(err.message || 'Delete avatar failed')
		}
		throw e
	}
}

export async function refToken(token: string): Promise<TokenResponse> {
	const apiAuth = createApiAuth(token)

	try {
		const response = await apiAuth.post('/auth/refresh', {
			refresh_token: token,
		})
		return response.data
	} catch (e) {
		if ((e as AxiosError).response) {
			const err = (e as AxiosError).response!.data as { message: string }
			throw new Error(err.message || 'Token refresh failed')
		}
		throw e
	}
}