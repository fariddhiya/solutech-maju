import { NextResponse } from 'next/server';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export function success<T>(data: T, message = 'Success', status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, message, data },
    { status }
  );
}

export function error(
  message: string,
  status = 500,
  errors?: Record<string, string[]>
) {
  return NextResponse.json<ApiResponse>(
    { success: false, message, errors },
    { status }
  );
}
