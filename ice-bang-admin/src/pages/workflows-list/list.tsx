// src/pages/scheduler-history/list.tsx
import { List, ShowButton, useTable } from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { CrudFilter, useApiUrl } from "@refinedev/core";
import { SearchOutlined } from "@ant-design/icons";
import { Space, Table, Tag, Tooltip, Button, Card, Form, Row, Col, Input, Select } from "antd";
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  ClockCircleOutlined,
  EyeOutlined 
} from "@ant-design/icons";
import React, { useState, useMemo } from "react";
import { T } from "react-router/dist/development/index-react-server-client-BKpa2trA";

// =================================================================
// 1. 재사용 가능한 UI 컴포넌트
// =================================================================

const StatusTag = ({ isEnabled }: { isEnabled: boolean }) => {
  return (
    <Tag 
      color={isEnabled ? "success" : "default"}
    >
      {isEnabled ? "활성" : "비활성"}
    </Tag>
  );
};

export const WorkflowList = () => {
  const apiUrl = useApiUrl("workflows_list");

  // Refine useTable hook으로 API 호출
  const { tableProps, searchFormProps, filters, setFilters, setCurrent, setPageSize } = useTable({
    resource: "workflows_list", // App.tsx의 resource 이름과 일치
    syncWithLocation: true, // URL과 동기화
    filters: {
      initial: [],
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR");
  };

  // 검색 및 필터 처리
  const onSearch = (values: any) => {
    const newFilters: CrudFilter[] = [];

    // 이름 검색
    if (values.name && values.name.trim() !== '') {
      newFilters.push({
        field: "name",
        operator: "contains",
        value: values.name.trim(),
      });
    }

    // 설명 검색  
    if (values.description && values.description.trim() !== '') {
      newFilters.push({
        field: "description", 
        operator: "contains",
        value: values.description.trim(),
      });
    }

    // 생성자 필터
    if (values.created_by && values.created_by.trim() !== '') {
      newFilters.push({
        field: "createdBy",
        operator: "contains", 
        value: values.created_by.trim(),
      });
    }

    // 활성 여부 필터
    if (values.isEnabled !== undefined && values.isEnabled !== '') {
      newFilters.push({
        field: "isEnabled",
        operator: "eq",
        value: values.isEnabled,
      });
    }

    // Refine의 내장 필터 관리 사용 - URL과 자동 동기화됨
    setFilters(newFilters, "replace");
    setCurrent(1); // 검색 시 첫 페이지로
  };

  // 필터 초기화 - Refine 방식 사용
  const onReset = () => {
    // 폼 필드 초기화
    searchFormProps.form?.setFieldsValue({
      name: '',
      description: '',
      created_by: '',
      isEnabled: ''
    });
    
    // 필터 완전 초기화 - Refine이 URL도 자동으로 정리
    setFilters([], "replace");
    setCurrent(1);
    setPageSize(10);
  };

  return (
    <List title="워크플로우 리스트">
      {/* 필터링 영역 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          {...searchFormProps}
          layout="vertical"
          onFinish={(values) => {
            console.log('Form onFinish 호출됨:', values);
            onSearch(values);
          }}
          initialValues={{
            name: '',
            description: '',
            created_by: '',
            isEnabled: ''
          }}
        >
          {/* 첫 번째 줄: 이름, 설명 */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="이름"
                name="name"
              >
                <Input
                  placeholder="워크플로우 이름을 입력하세요"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="설명"
                name="description"
              >
                <Input
                  placeholder="설명을 입력하세요"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="생성자"
                name="created_by"
              >
                <Input
                  placeholder="생성자를 입력하세요"
                  allowClear
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="활성 여부"
                name="isEnabled"
              >
                <Select
                  placeholder="전체"
                  allowClear
                  options={[
                    { value: '', label: '전체' },
                    { value: true, label: '활성' },
                    { value: false, label: '비활성' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={onReset}>
                  초기화
                </Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  검색
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
        <Table.Column dataIndex="id" title="ID" width={60} fixed="left" />
        <Table.Column dataIndex="name" title="이름" width={200} fixed="left" />
        <Table.Column dataIndex="description" title="설명" width={200} fixed="left" />
        <Table.Column dataIndex="isEnabled" title="활성 여부" width={100} render={(isEnabled) => <StatusTag isEnabled={isEnabled} />} />
        <Table.Column dataIndex="createdBy" title="생성자" width={120} />
        <Table.Column dataIndex="createdAt" title="생성일시" width={180} render={(date) => formatDateTime(date)} />
        <Table.Column
          title="작업"
          dataIndex="actions"
          width={120}
          fixed="right"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
        <Table.Column
          title="수동 실행"
          width={180}
          fixed="left"
          render={(_, record) => (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                fetch(`${apiUrl}/v0/workflows/${record.id}/run`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                .then(response => response.json())
                .then(data => {
                  console.log('워크플로우 실행 성공:', data);
                })
                .catch(error => {
                  console.error('워크플로우 실행 실패:', error);
                });
              }}
            >
              실행
            </Button>
          )}
        />
      </Table>
    </List>
  );
};