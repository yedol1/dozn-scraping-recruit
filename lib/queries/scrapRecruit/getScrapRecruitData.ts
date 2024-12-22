export interface ScrapRecruitDataResponse {
  errYn: string;
  code: string;
  msg: string;
  data: {
    out: {
      description: string;
    };
  };
}

export async function getScrapRecruitData({
  token,
  apiCd,
  mdulCustCd,
}: {
  token: string;
  apiCd: string;
  mdulCustCd: string;
}) {
  // 쿼리 파라미터로 apiCd, mdulCustCd
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/api/recruit/scrp-recruit?apiCd=${apiCd}&mdulCustCd=${mdulCustCd}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('스크래핑 호출 실패');
  }

  return res.json() as Promise<ScrapRecruitDataResponse>;
}
