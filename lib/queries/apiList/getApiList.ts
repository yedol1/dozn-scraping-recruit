export interface ApiItem {
  admUserId: string;
  apiNm: string;
  apiDesc: string;
  apiCd: string;
  kwrdCd: string;
  kwrdNm: string;
  prvr: string;
  apiCdUid: string;
  apiLogStus: string;
  userApiStus: string;
  changeAble: string;
  cmnCdLginType: string;
  cmnCdLginTypeNm: string;
  mdulCustCd: string;
  mdulNm: string;
}

export interface ApiListResponse {
  errYn: string;
  code: string;
  msg: string;
  data: {
    list: ApiItem[];
    totalCount: number;
    totalPage: number;
  };
}

export async function getApiList(token: string, page: number, pageSize = 10) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/api/user/api/list?pageIdx=${page}&pageSize=${pageSize}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('API 목록 조회 실패');
  }

  return res.json() as Promise<ApiListResponse>;
}
