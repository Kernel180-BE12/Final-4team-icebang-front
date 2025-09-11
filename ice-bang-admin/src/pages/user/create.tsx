// import { Create, useForm, useSelect } from "@refinedev/antd";
// import { Form, Input, Select, Card, Tag, Space, Button, message, Row, Col } from "antd";
// import { useState } from "react";
// import { useApiUrl, useCustom } from "@refinedev/core";
// import { CheckCircleOutlined } from "@ant-design/icons";
//
// export const UserCreate = () => {
//   const { formProps, saveButtonProps } = useForm({});
//   const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
//   const [emailChecked, setEmailChecked] = useState(false);
//   const [emailCheckLoading, setEmailCheckLoading] = useState(false);
//   const [currentEmail, setCurrentEmail] = useState('');
//
//   const apiUrl = useApiUrl();
//
//   // 조직 데이터
//   const { selectProps: organizationSelectProps } = useSelect({
//     resource: "organizations",
//     optionLabel: "name",
//     optionValue: "id",
//   });
//
//   // 부서 데이터
//   const { selectProps: departmentSelectProps } = useSelect({
//     resource: "departments",
//     optionLabel: "name",
//     optionValue: "id",
//   });
//
//   // 직위 데이터
//   const { selectProps: positionSelectProps } = useSelect({
//     resource: "positions",
//     optionLabel: "title",
//     optionValue: "id",
//   });
//
//   // 역할 데이터 - SQL에서 정의된 역할들
//   const roleOptions = [
//     // 시스템 공통 역할
//     { value: "SUPER_ADMIN", label: "최고 관리자" },
//     { value: "SYSTEM_ADMIN", label: "시스템 관리자" },
//     { value: "ORG_ADMIN", label: "조직 관리자" },
//     { value: "USER", label: "일반 사용자" },
//     { value: "GUEST", label: "게스트" },
//
//     // icebang 전용 역할
//     { value: "AI_ENGINEER", label: "AI 엔지니어" },
//     { value: "DATA_SCIENTIST", label: "데이터 사이언티스트" },
//     { value: "CRAWLING_ENGINEER", label: "크롤링 엔지니어" },
//     { value: "CONTENT_CREATOR", label: "콘텐츠 크리에이터" },
//     { value: "CONTENT_MANAGER", label: "콘텐츠 매니저" },
//     { value: "WORKFLOW_ADMIN", label: "워크플로우 관리자" },
//     { value: "MARKETING_ANALYST", label: "마케팅 분석가" },
//     { value: "OPERATIONS_MANAGER", label: "운영 매니저" },
//
//     // 외부 회사 역할들
//     { value: "DEPT_MANAGER", label: "부서 관리자" },
//     { value: "TEAM_LEAD", label: "팀장" },
//     { value: "SENIOR_DEV", label: "시니어 개발자" },
//     { value: "JUNIOR_DEV", label: "주니어 개발자" },
//     { value: "PROJECT_MANAGER", label: "프로젝트 매니저" },
//     { value: "DESIGNER", label: "디자이너" },
//     { value: "HR_SPECIALIST", label: "인사 담당자" },
//     { value: "TECH_LEAD", label: "기술 리드" },
//     { value: "PRODUCT_OWNER", label: "프로덕트 오너" },
//     { value: "QA_ENGINEER", label: "QA 엔지니어" },
//     { value: "DEVOPS", label: "DevOps 엔지니어" },
//     { value: "CREATIVE_DIRECTOR", label: "크리에이티브 디렉터" },
//     { value: "ART_DIRECTOR", label: "아트 디렉터" },
//     { value: "MOTION_DESIGNER", label: "모션 디자이너" },
//     { value: "COPYWRITER", label: "카피라이터" },
//   ];
//
//   // 역할 변경 핸들러
//   const handleRoleChange = (values: string[]) => {
//     setSelectedRoles(values);
//     // Form 필드에 값 설정
//     formProps.form?.setFieldsValue({ roles: values });
//   };
//
//   // 역할 제거 핸들러
//   const handleRoleRemove = (roleValue: string) => {
//     const newRoles = selectedRoles.filter(role => role !== roleValue);
//     setSelectedRoles(newRoles);
//     formProps.form?.setFieldsValue({ roles: newRoles });
//   };
//
//   // 이메일 중복확인
//   const checkEmailDuplicate = async () => {
//     const email = formProps.form?.getFieldValue('email');
//
//     if (!email) {
//       message.error('이메일을 먼저 입력해주세요.');
//       return;
//     }
//
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       message.error('올바른 이메일 형식이 아닙니다.');
//       return;
//     }
//
//     setEmailCheckLoading(true);
//
//     try {
//       // 임시 중복확인 로직 (실제로는 API 호출해야 함)
//       await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
//
//       // 임시: admin@로 시작하는 이메일은 중복으로 처리
//       const isDuplicate = email.startsWith('admin@');
//
//       if (isDuplicate) {
//         message.error('이미 사용 중인 이메일입니다.');
//         setEmailChecked(false);
//         setCurrentEmail('');
//       } else {
//         message.success('사용 가능한 이메일입니다.');
//         setEmailChecked(true);
//         setCurrentEmail(email); // 중복확인된 이메일 저장
//         // 강제로 validation 재실행
//         setTimeout(() => {
//           formProps.form?.validateFields(['email']);
//         }, 100);
//       }
//     } catch (error) {
//       message.error('이메일 중복확인 중 오류가 발생했습니다.');
//       setEmailChecked(false);
//       setCurrentEmail('');
//     } finally {
//       setEmailCheckLoading(false);
//     }
//   };
//
//   // 이메일 필드 변경 시 중복확인 상태 초기화
//   const handleEmailChange = (e: any) => {
//     const newEmail = e.target.value;
//     // 이메일이 변경되면 중복확인 상태 초기화
//     if (newEmail !== currentEmail) {
//       setEmailChecked(false);
//       setCurrentEmail('');
//     }
//   };
//
//   return (
//     <Create saveButtonProps={saveButtonProps}>
//       <Form {...formProps} layout="vertical">
//         <Card title="기본 정보" style={{ marginBottom: 16 }}>
//           <Form.Item
//             label="이름"
//             name="name"
//             rules={[
//               {
//                 required: true,
//                 message: "이름을 입력해주세요.",
//               },
//             ]}
//           >
//             <Input placeholder="사용자 이름을 입력하세요" />
//           </Form.Item>
//
//           <Form.Item
//             label="이메일"
//             name="email"
//             rules={[
//               {
//                 required: true,
//                 message: "이메일을 입력해주세요.",
//               },
//               {
//                 type: "email",
//                 message: "올바른 이메일 형식이 아닙니다.",
//               },
//               {
//                 validator: (_, value) => {
//                   // 현재 이메일과 중복확인된 이메일이 같고, 중복확인이 완료된 경우
//                   if (value && value === currentEmail && emailChecked) {
//                     return Promise.resolve();
//                   }
//                   // 이메일이 있지만 중복확인이 안 된 경우
//                   if (value) {
//                     return Promise.reject(new Error('이메일 중복확인을 해주세요.'));
//                   }
//                   return Promise.resolve();
//                 },
//               },
//             ]}
//           >
//             <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
//               <div style={{ flex: 1 }}>
//                 <Input
//                   placeholder="user@example.com"
//                   onChange={handleEmailChange}
//                 />
//                 {emailChecked && currentEmail === formProps.form?.getFieldValue('email') && (
//                   <div style={{
//                     marginTop: 4,
//                     color: '#52c41a',
//                     fontSize: 14,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 4
//                   }}>
//                     <CheckCircleOutlined />
//                     중복확인이 완료되었습니다.
//                   </div>
//                 )}
//               </div>
//               <Button
//                 type={emailChecked ? "default" : "primary"}
//                 onClick={checkEmailDuplicate}
//                 loading={emailCheckLoading}
//                 style={{ flexShrink: 0 }}
//                 disabled={emailChecked}
//               >
//                 {emailChecked ? "완료" : "중복확인"}
//               </Button>
//             </div>
//           </Form.Item>
//
//           <Form.Item
//             label="비밀번호"
//             name="password"
//             rules={[
//               {
//                 required: true,
//                 message: "비밀번호를 입력해주세요.",
//               },
//               {
//                 min: 8,
//                 message: "비밀번호는 최소 8자 이상이어야 합니다.",
//               },
//             ]}
//           >
//             <Input.Password placeholder="비밀번호를 입력하세요" />
//           </Form.Item>
//
//           <Form.Item
//             label="상태"
//             name="status"
//             initialValue="PENDING"
//             rules={[
//               {
//                 required: true,
//                 message: "상태를 선택해주세요.",
//               },
//             ]}
//           >
//             <Select
//               placeholder="상태를 선택하세요"
//               style={{ width: 200 }}
//               options={[
//                 { value: "ACTIVE", label: "활성" },
//                 { value: "INACTIVE", label: "비활성" },
//                 { value: "PENDING", label: "승인대기" },
//               ]}
//             />
//           </Form.Item>
//         </Card>
//
//         <Card title="조직 정보">
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item
//                 label="조직"
//                 name={["user_organizations", 0, "organization_id"]}
//                 rules={[
//                   {
//                     required: true,
//                     message: "조직을 선택해주세요.",
//                   },
//                 ]}
//               >
//                 <Select {...organizationSelectProps} placeholder="조직을 선택하세요" />
//               </Form.Item>
//             </Col>
//
//             <Col span={8}>
//               <Form.Item
//                 label="부서"
//                 name={["user_organizations", 0, "department_id"]}
//                 rules={[
//                   {
//                     required: true,
//                     message: "부서를 선택해주세요.",
//                   },
//                 ]}
//               >
//                 <Select {...departmentSelectProps} placeholder="부서를 선택하세요" />
//               </Form.Item>
//             </Col>
//
//             <Col span={8}>
//               <Form.Item
//                 label="직위"
//                 name={["user_organizations", 0, "position_id"]}
//                 rules={[
//                   {
//                     required: true,
//                     message: "직위를 선택해주세요.",
//                   },
//                 ]}
//               >
//                 <Select {...positionSelectProps} placeholder="직위를 선택하세요" />
//               </Form.Item>
//             </Col>
//           </Row>
//
//           <Form.Item
//             label="역할"
//             name="roles"
//             rules={[
//               {
//                 required: true,
//                 message: "역할을 선택해주세요.",
//               },
//             ]}
//           >
//             <div style={{ position: 'relative' }}>
//               <Select
//                 mode="multiple"
//                 placeholder="역할을 선택하세요 (복수 선택 가능)"
//                 options={roleOptions}
//                 onChange={handleRoleChange}
//                 value={selectedRoles}
//                 tagRender={() => <></>}
//                 style={{
//                   width: '100%'
//                 }}
//               />
//               {selectedRoles.length > 0 && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: '6px',
//                     left: '11px',
//                     color: '#000',
//                     pointerEvents: 'none',
//                     zIndex: 1
//                   }}
//                 >
//                   역할을 선택하세요 (복수 선택 가능)
//                 </div>
//               )}
//             </div>
//           </Form.Item>
//
//           {/* 선택된 역할 표시 영역을 Form.Item 밖으로 */}
//           {selectedRoles.length > 0 && (
//             <div style={{ marginTop: -16, marginBottom: 16 }}>
//               <Space wrap>
//                 {selectedRoles.map((roleValue) => {
//                   const roleOption = roleOptions.find((option: any) => option.value === roleValue);
//                   return roleOption ? (
//                     <Tag
//                       key={roleValue}
//                       closable
//                       onClose={() => handleRoleRemove(roleValue)}
//                     >
//                       {roleOption.label}
//                     </Tag>
//                   ) : null;
//                 })}
//               </Space>
//             </div>
//           )}
//         </Card>
//       </Form>
//     </Create>
//   );
// };
