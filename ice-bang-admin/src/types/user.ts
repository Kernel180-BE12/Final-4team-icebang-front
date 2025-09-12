// 백엔드 AuthCredential & UserProfileResponseDto 기반 Interface
export interface IUser {
  id: string; // BigInteger는 JavaScript에서 string으로 처리
  email: string; // username으로도 사용 (로그인 ID)
  name: string; // UserProfileResponseDto에서 추가
  roles: string[]; // List<String> - "ROLE_" prefix 없는 순수 role명
  status: string; // LOCKED, DISABLED 등
}

// 백엔드 RegisterDto 기반 사용자 생성 요청
export interface IUserCreateRequest {
  name: string; // @NotBlank - 필수
  email: string; // @NotBlank @Email - 필수 (로그인 ID로도 사용)
  orgId: string; // @NotNull BigInteger - 필수 (조직)
  deptId: string; // @NotNull BigInteger - 필수 (부서)
  positionId: string; // @NotNull BigInteger - 필수 (직책)
  roleIds: string[]; // @NotNull Set<BigInteger> - 필수 (역할)
  // id, userOrgId, password, status는 백엔드에서 자동 처리 (@Null)
}

// 사용자 수정 요청 (추후 백엔드 UpdateDto 스펙에 맞게 수정 필요)
export interface IUserUpdateRequest {
  name?: string;
  email?: string;
  orgId?: string;
  deptId?: string;
  positionId?: string;
  roleIds?: string[];
  status?: string; // 관리자가 계정 상태 변경
}

// 로그인 요청 (AuthCredential 기반)
export interface ILoginRequest {
  email: string; // username으로 사용
  password: string;
}

// 로그인 응답 (JWT 토큰 등)
export interface ILoginResponse extends IApiResponse<{
  accessToken: string;
  refreshToken?: string;
  user: IUser;
}> {}

// 백엔드 공통 API 응답 구조
export interface IApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  status: string;
}

// 사용자 목록 응답 (실제 백엔드 페이징 구조에 맞게 추가 수정 필요)
export interface IUserListResponse {
  success: boolean;
  data: {
    content: IUser[]; // 백엔드에서 보통 content 사용
    totalElements: number; // total vs totalElements
    totalPages: number;
    number: number; // page number (0-based)
    size: number; // page size
    first: boolean;
    last: boolean;
  };
  message: string;
  status: string;
}

// 단일 사용자 응답
export interface IUserResponse extends IApiResponse<IUser> {}

// 사용자 생성 응답 (data가 null일 수 있음)
export interface IUserCreateResponse extends IApiResponse<IUser | null> {}

// 필터링용 타입
export interface IUserFilters {
  name?: string;
  email?: string;
  orgId?: string;
  deptId?: string;
  positionId?: string;
  roleIds?: string;
  status?: string;
}

// 정렬용 타입
export interface IUserSorter {
  field: keyof IUser;
  order: 'asc' | 'desc';
}

// 조직/부서/직책 관련 Interface (추후 백엔드 스펙 확인 필요)
export interface IOrganization {
  id: string;
  name: string;
}

export interface IDepartment {
  id: string;
  name: string;
  orgId: string;
}

export interface IPosition {
  id: string;
  name: string;
}

export interface IRole {
  id: string;
  name: string;
  description?: string;
}

// AuthCredential 기반 실제 Status 상수
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE', 
  LOCKED: 'LOCKED',     // AuthCredential에서 확인
  DISABLED: 'DISABLED', // AuthCredential에서 확인
  PENDING: 'PENDING'    // 일반적으로 사용되는 값
} as const;

// Role 관련 유틸리티
export const ROLE_PREFIX = 'ROLE_'; // Spring Security에서 사용하는 prefix

// Role을 Spring Security 형태로 변환
export const toSpringSecurityRole = (role: string): string => {
  return role.startsWith(ROLE_PREFIX) ? role : `${ROLE_PREFIX}${role.trim()}`;
};

// Spring Security Role에서 순수 role명 추출
export const fromSpringSecurityRole = (role: string): string => {
  return role.startsWith(ROLE_PREFIX) ? role.substring(ROLE_PREFIX.length) : role;
};

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// 계정 상태 체크 유틸리티 (AuthCredential 로직 기반)
export const isAccountLocked = (status: string): boolean => {
  return status?.toUpperCase() === 'LOCKED';
};

export const isAccountEnabled = (status: string): boolean => {
  return status?.toUpperCase() !== 'DISABLED';
};

export const isAccountActive = (status: string): boolean => {
  return !isAccountLocked(status) && isAccountEnabled(status);
};
