export interface RefreshTokenCreateDTO {
  userId: string;
  familyId: string;
}

export interface RefreshTokenUpdateDTO {
  isRevoked: boolean;
  replacedAt: Date;
}

export interface RefreshTokenResponseDTO {
  userId: string;
  token: string;
  familyId: string;
  isRevoked: boolean;
  replacedAt: Date | undefined;
  expiresAt: Date;
}
