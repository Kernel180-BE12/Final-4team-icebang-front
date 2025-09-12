import { DataProvider } from "@refinedev/core";
import mockUsersData from "../data/mockUsers.json";
import mockOrganizationsData from "../data/mockOrganizations.json";
import mockDepartmentsData from "../data/mockDepartments.json";
import mockPositionsData from "../data/mockPositions.json";
import mockRolesData from "../data/mockRoles.json";

// Mock 데이터를 시뮬레이션하는 Provider
export const mockDataProvider: DataProvider = {
  // 목록 조회
  getList: async ({ resource, pagination, filters, sorters }: any) => {
    let data: any[] = [];
    
    switch (resource) {
      case "users":
        data = mockUsersData.data.content;
        break;
      case "organizations":
        data = mockOrganizationsData.data.content;
        break;
      case "departments":
        data = mockDepartmentsData.data.content;
        break;
      case "positions":
        data = mockPositionsData.data.content;
        break;
      case "roles":
        data = mockRolesData.data.content;
        break;
      default:
        throw new Error(`Resource ${resource} not found`);
    }

    // 필터링 시뮬레이션
    let filteredData = data;
    if (filters && filters.length > 0) {
      filteredData = data.filter((item) => {
        return filters.every((filter: any) => {
          const { field, operator, value } = filter;
          
          // 값이 빈 문자열, null, undefined면 필터링 안함
          if (value === '' || value === null || value === undefined) {
            return true;
          }
          
          if (operator === "contains") {
            const fieldValue = item[field];
            if (fieldValue === null || fieldValue === undefined) return false;
            const result = fieldValue.toString().toLowerCase().includes(value.toLowerCase());
            return result;
          }
          
          if (operator === "eq") {
            // 중첩 필드 처리 (예: user_organizations.organization_id)
            if (field.includes('.')) {
              const parts = field.split('.');
              let fieldValue = item;
              
              for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                
                if (fieldValue === null || fieldValue === undefined) {
                  fieldValue = null;
                  break;
                }
                
                // 첫 번째 part가 배열인 경우 (user_organizations)
                if (part === 'user_organizations' && Array.isArray(item[part])) {
                  fieldValue = item[part].length > 0 ? item[part][0] : null;
                } else {
                  fieldValue = fieldValue[part];
                }
              }
              
              const result = fieldValue === value;
              return result;
            }
            
            // 일반 필드 처리
            const result = item[field] === value;
            return result;
          }
          
          return true;
        });
      });
    }

    // 정렬 시뮬레이션
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      filteredData.sort((a, b) => {
        let aValue = a[sorter.field];
        let bValue = b[sorter.field];
        
        // ID 필드는 숫자로 변환해서 정렬
        if (sorter.field === "id") {
          aValue = parseInt(aValue);
          bValue = parseInt(bValue);
        }
        
        if (sorter.order === "asc") {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
    }

    // 페이징 처리
    const { current = 1, pageSize = 10 } = pagination || {};
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: filteredData.length,
    };
  },

  // 단일 항목 조회
  getOne: async ({ resource, id }: any) => {
    let data: any[] = [];
    
    switch (resource) {
      case "users":
        data = mockUsersData.data.content;
        break;
      case "organizations":
        data = mockOrganizationsData.data.content;
        break;
      case "departments":
        data = mockDepartmentsData.data.content;
        break;
      case "positions":
        data = mockPositionsData.data.content;
        break;
      case "roles":
        data = mockRolesData.data.content;
        break;
      default:
        throw new Error(`Resource ${resource} not found`);
    }

    const item = data.find((item) => item.id === id);
    if (item) {
      return { data: item };
    }
    throw new Error(`${resource} with id ${id} not found`);
  },

  // 여러 항목 조회 (useMany용)
  getMany: async ({ resource, ids }: any) => {
    let data: any[] = [];
    
    switch (resource) {
      case "users":
        data = mockUsersData.data.content;
        break;
      case "organizations":
        data = mockOrganizationsData.data.content;
        break;
      case "departments":
        data = mockDepartmentsData.data.content;
        break;
      case "positions":
        data = mockPositionsData.data.content;
        break;
      case "roles":
        data = mockRolesData.data.content;
        break;
      default:
        throw new Error(`Resource ${resource} not found`);
    }

    const items = data.filter((item) => ids.includes(item.id));
    return { data: items };
  },

  // 생성
  create: async ({ resource, variables }: any) => {
    if (resource === "users") {
      // Mock 데이터 구조에 맞게 사용자 생성
      const userVariables = variables as Record<string, any>;
      const userId = Date.now().toString();
      
      const newUser = {
        id: userId,
        name: userVariables.name || "새 사용자",
        email: userVariables.email || "new@example.com",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_organizations: [{
          id: Date.now().toString(),
          user_id: userId,
          organization_id: userVariables.orgId || "1",
          department_id: userVariables.deptId || "1",
          position_id: userVariables.positionId || "1",
          employee_number: `EMP${Date.now()}`,
          status: "ACTIVE"
        }],
        user_roles: userVariables.roleIds ? 
          userVariables.roleIds.map((roleId: string, index: number) => ({
            id: `${Date.now()}_${index}`,
            user_id: userId,
            role_id: roleId
          })) : 
          [{
            id: Date.now().toString(),
            user_id: userId,
            role_id: "7" // USER 역할
          }]
      };
      
      return { data: newUser };
    }
    
    // 다른 리소스는 기본 처리
    const newItem = {
      id: Date.now().toString(),
      ...variables,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return { data: newItem };
  },

  // 수정
  update: async ({ resource, id, variables }: any) => {
    if (resource === "users") {
      const existingUser = mockUsersData.data.content.find((u) => u.id === id);
      if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
      }

      const updatedUser = {
        ...existingUser,
        ...variables,
        updated_at: new Date().toISOString()
      };

      return { data: updatedUser };
    }
    
    // 다른 리소스 처리
    const updatedItem = {
      id,
      ...variables,
      updated_at: new Date().toISOString()
    };
    
    return { data: updatedItem };
  },

  // 삭제
  deleteOne: async ({ resource, id }: any): Promise<any> => {
    if (resource === "users") {
      const user = mockUsersData.data.content.find((u) => u.id === id);
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return { data: user };
    }
    
    // 다른 리소스는 기본 처리
    return { data: { id } };
  },

  // API URL 반환
  getApiUrl: () => "mock://api",

  // 기타 필수 메서드들
  deleteMany: async ({ resource, ids }: any): Promise<any> => {
    return { data: ids.map((id: any) => ({ id })) };
  },

  updateMany: async ({ resource, ids, variables }: any): Promise<any> => {
    return { 
      data: ids.map((id: any) => ({ 
        id, 
        ...variables,
        updated_at: new Date().toISOString() 
      })) 
    };
  },

  createMany: async ({ resource, variables }: any): Promise<any> => {
    const items = Array.isArray(variables) ? variables : [variables];
    return { 
      data: items.map((item, index) => ({ 
        ...item, 
        id: `${Date.now()}_${index}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    };
  },

  custom: async (): Promise<any> => {
    throw new Error("Custom method not implemented");
  },
};
