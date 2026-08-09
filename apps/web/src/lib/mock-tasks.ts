export interface MockTask {
  id: string;
  title: string;
  assignee: { name: string };
  dueDate: string;
  tags: string[];
}
export interface MockColumn {
  id: string;
  name: string;
  tasks: MockTask[];
}

export const MOCK_COLUMNS: MockColumn[] = [
  { id: 'todo', name: 'To Do', tasks: [
    { id: '1', title: 'Write API Documentation', assignee: { name: 'Admin' }, dueDate: '29 Jul', tags: ['Deployment', 'Deployment'] },
    { id: '2', title: 'Implement Search Function', assignee: { name: 'Admin' }, dueDate: '29 Jul', tags: ['Deployment', 'Deployment'] },
    { id: '3', title: 'Deploy to Production', assignee: { name: 'Admin' }, dueDate: '29 Jul', tags: ['Deployment', 'Deployment'] },
  ]},
  { id: 'doing', name: 'Doing', tasks: [
    { id: '4', title: 'Code Review Completed', assignee: { name: 'Admin' }, dueDate: '29 Jul', tags: ['Deployment', 'Deployment'] },
    { id: '5', title: 'Design Mockups Finalized', assignee: { name: 'Admin' }, dueDate: '29 Jul', tags: ['Deployment', 'Deployment'] },
  ]},
  { id: 'completed', name: 'Completed', tasks: [
    { id: '6', title: 'Feature Testing Passed', assignee: { name: 'QA Team' }, dueDate: '30 Jul', tags: ['Testing', 'Passed'] },
    { id: '7', title: 'UI Design Updated', assignee: { name: 'Designer' }, dueDate: '31 Jul', tags: ['Design', 'Updated'] },
    { id: '8', title: 'Security Audit Scheduled', assignee: { name: 'Security' }, dueDate: '01 Aug', tags: ['Audit', 'Scheduled'] },
  ]},
  { id: 'onhold', name: 'On Hold', tasks: [
    { id: '9', title: 'UI Review', assignee: { name: 'Designer' }, dueDate: '', tags: ['Review'] },
    { id: '10', title: 'Backend Integration', assignee: { name: 'Dev Team' }, dueDate: '', tags: ['Development'] },
  ]},
];