export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export interface EditProfileDTO {
  name?: string;
  profile_url?: string;
}
