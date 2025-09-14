import { DataProvider } from "@refinedev/core";
import { PageResult, request } from "./request";

const API_URL = import.meta.env.VITE_API_URL;

export const dataProvider: DataProvider = {
 getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const url = `${API_URL}/${resource}`;
    
    // 페이징 파라미터 구성
    const { current = 1, pageSize = 10 } = pagination ?? {};
    
    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      current: current.toString(),
      pageSize: pageSize.toString(),
    });
    
    // 검색 필터 처리 - Refine v5/v6 타입 안전성
    if (filters) {
      filters.forEach((filter) => {
        // LogicalFilter 타입 체크 (field, operator, value 속성을 가진 경우)
        if (
          typeof filter === 'object' && 
          filter !== null && 
          'field' in filter && 
          'value' in filter
        ) {
          if (filter.field === "search" && filter.value) {
            queryParams.append("search", filter.value.toString());
          }
        }
      });
    }
    
    // 정렬 처리
    if (sorters && sorters.length > 0) {
      sorters.forEach((sorter, index) => {
        queryParams.append(`sorters[${index}][field]`, sorter.field);
        queryParams.append(`sorters[${index}][order]`, sorter.order);
      });
    }
    
    try {
      // 공통 request 함수 사용으로 ApiResponse 언래핑 자동 처리
      const pageResult = await request<PageResult<any>>(`${url}?${queryParams.toString()}`);
      
      return {
        data: pageResult.data,
        total: pageResult.total,
        // Refine이 사용할 추가 메타 정보
        meta: {
          current: pageResult.current,
          pageSize: pageResult.pageSize,
          totalPages: pageResult.totalPages,
          hasNext: pageResult.hasNext,
          hasPrevious: pageResult.hasPrevious,
        },
      };
    } catch (error) {
      console.error("Data provider getList error:", error);
      throw error; // request 함수에서 이미 적절한 에러 메시지 생성됨
    }
  },
  
  getOne: async ({ resource, id, meta }) => {
    // TODO: 단일 항목 조회 구현
    throw new Error("getOne not implemented yet");
  },

  create: async ({ resource, variables, meta }) => {
    // TODO: 생성 구현
    throw new Error("create not implemented yet");
  },

  update: async ({ resource, id, variables, meta }) => {
    // TODO: 수정 구현
    throw new Error("update not implemented yet");
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    // TODO: 삭제 구현
    throw new Error("deleteOne not implemented yet");
  },

  getApiUrl: () => API_URL,
};

export default dataProvider;