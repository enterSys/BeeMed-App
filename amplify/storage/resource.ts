import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'beeMedStorage',
  access: (allow) => ({
    'profile-pictures/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'course-materials/*': [
      allow.authenticated.to(['read']),
      allow.groups(['Instructors', 'Admins']).to(['read', 'write', 'delete']),
    ],
    'quiz-attachments/*': [
      allow.authenticated.to(['read']),
      allow.groups(['Instructors', 'Admins']).to(['read', 'write', 'delete']),
    ],
    'case-studies/*': [
      allow.authenticated.to(['read']),
      allow.groups(['Instructors', 'Admins']).to(['read', 'write', 'delete']),
    ],
  }),
});