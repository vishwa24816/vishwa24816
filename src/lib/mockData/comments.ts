
import type { Comment } from '@/types';

export const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    user: {
      name: 'Eagle Eye',
      username: '@EagleEye',
      avatarUrl: 'https://placehold.co/40x40.png?text=EE',
    },
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    content: 'Good analysis. The consolidation around 2400 was a key indicator. I have taken a long position.',
    likes: 25,
  },
  {
    id: 'comment2',
    postId: 'post1',
    user: {
      name: 'Skeptical Sam',
      username: '@SamTheSkeptic',
      avatarUrl: 'https://placehold.co/40x40.png?text=SS',
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    content: 'I am not so sure. The global macros are not looking good. Might wait for a dip before entering.',
    likes: 12,
  },
   {
    id: 'comment3',
    postId: 'post2',
    user: {
      name: 'Diamond Hands',
      username: '@DiamondHands',
      avatarUrl: 'https://placehold.co/40x40.png?text=DH',
    },
    timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(),
    content: 'HODL! Bitcoin is inevitable. These short-term movements are just noise.',
    likes: 150,
  },
  {
    id: 'comment4',
    postId: 'research1',
    user: {
      name: 'Tech Investor',
      username: '@TechInvest',
      avatarUrl: 'https://placehold.co/40x40.png?text=TI',
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    content: 'Solid report from InvestSmart. I agree with the BUY rating. INFY is a cash-generating machine and is well-positioned for the future.',
    likes: 45,
  },
];
