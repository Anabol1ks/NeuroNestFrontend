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

export type NoteInput = {
	title: string
	content: string
	related_ids: number[]
	tag_ids: number[]
	attachments: File[]
}

export async function createNote(
	token: string,
	data: NoteInput
): Promise<void> {
	const apiAuth = createApiAuth(token)

	// Create FormData object for multipart/form-data
	const formData = new FormData()

	// Add text fields
	formData.append('title', data.title)
	formData.append('content', data.content)

	// Add arrays with the correct format: related_ids[] and tag_ids[]
	if (data.related_ids && data.related_ids.length > 0) {
		data.related_ids.forEach(id => {
			formData.append('related_ids[]', id.toString())
		})
	}

	if (data.tag_ids && data.tag_ids.length > 0) {
		data.tag_ids.forEach(id => {
			formData.append('tag_ids[]', id.toString())
		})
	}

	// Add file attachments
	if (data.attachments && data.attachments.length > 0) {
		data.attachments.forEach(file => {
			formData.append('attachments', file)
		})
	}

	// Log the FormData entries to debug
	console.log('FormData contents:')
	for (let pair of formData.entries()) {
		console.log(pair[0] + ': ' + pair[1])
	}

	try {
		await apiAuth.post('/notes/create', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	} catch (e) {
		if ((e as AxiosError).response) {
			const err = (e as AxiosError).response!.data as { message: string }
			throw new Error(err.message || 'Create note failed')
		}
		throw e
	}
}



export type Attachment = {
	file_size: number
	file_type: string
	file_url: string
	id: number
}

export type Tag = {
	id: number
	name: string
}

export type Note = {
	attachments: Attachment[]
	content: string
	created_at: string
	id: number
	is_archived: boolean
	related_ids: number[]
	summary: string
	tags: Tag[]
	title: string
	topic_id: number
	updated_at: string
}

export type NotesResponse = {
	notes: Note[]
	total: number
}

export async function getNotes(token: string): Promise<NotesResponse> {
	const apiAuth = createApiAuth(token)

	try {
		const resp = await apiAuth.get<NotesResponse>("/notes/list");
		return resp.data
	} catch(e) {
		if ((e as AxiosError).response) {
			const err = (e as AxiosError).response!.data as ErrorResponse;
			throw new Error(err.message || 'Could not fetch notes');
		}
		throw e
	}
}